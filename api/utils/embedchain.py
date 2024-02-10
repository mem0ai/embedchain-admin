import asyncio
import json
import logging
import os
from typing import AsyncIterable

from embedchain import App
from embedchain.config import BaseLlmConfig
from langchain.callbacks.streaming_aiter import AsyncIteratorCallbackHandler
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage

# App config using OpenAI gpt-3.5-turbo-1106 as LLM
EC_APP_CONFIG = {
    "app": {
        "config": {
            "id": "embedchain-demo-app",
        }
    },
    "llm": {
        "provider": "openai",
        "config": {
            "model": "gpt-3.5-turbo-1106",
        }
    }
}

# Uncomment this configuration to use Mistral as LLM
# EC_APP_CONFIG = {
#     "app": {
#         "config": {
#             "name": "embedchain-opensource-app"
#         }
#     },
#     "llm": {
#         "provider": "huggingface",
#         "config": {
#             "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
#             "temperature": 0.1,
#             "max_tokens": 250,
#             "top_p": 0.1
#         }
#     },
#     "embedder": {
#         "provider": "huggingface",
#         "config": {
#             "model": "sentence-transformers/all-mpnet-base-v2"
#         }
#     }
# }


async def generate_sources_str(sources_metadata):
    """Generate a string of unique source URLs from the sources metadata."""
    seen_urls = set()
    unique_sources = [source for source in sources_metadata if source['url'] not in seen_urls and not seen_urls.add(source['url'])]
    sources_str = "<sources>\n" + "\n".join(json.dumps(source) for source in unique_sources) + "\n</sources>\n\n"
    return sources_str


async def prepare_contexts_for_llm_query(ec_app, query, config, citations):
    """Retrieve contexts from the database and prepare them for the LLM query."""
    contexts = ec_app._retrieve_from_database(input_query=query, config=config, where={"app_id": ec_app.config.id}, citations=citations)
    if citations and contexts and isinstance(contexts[0], tuple):
        return [context[0] for context in contexts]
    return contexts


async def generate_messages(ec_app, query, contexts_data_for_llm_query, config):
    """Generate messages to be used in the LLM query."""
    messages = []
    if config.system_prompt:
        messages.append(SystemMessage(content=config.system_prompt))
    prompt = ec_app.llm.generate_prompt(query, contexts_data_for_llm_query)
    messages.append(HumanMessage(content=prompt))
    return messages


async def send_message(query, session_id, number_documents, citations, stream, model) -> AsyncIterable[str]:
    ec_app = App.from_config(config=EC_APP_CONFIG)
    context = ec_app.search(query, num_documents=number_documents)
    sources_str = await generate_sources_str([c['metadata'] for c in context])

    ec_app.llm.update_history(app_id=ec_app.config.id, session_id=session_id)
    callback = AsyncIteratorCallbackHandler()
    config = BaseLlmConfig(model=model, stream=stream, callbacks=[callback], api_key=os.environ["OPENAI_API_KEY"])
    contexts_data_for_llm_query = await prepare_contexts_for_llm_query(ec_app, query, config, citations)
    messages = await generate_messages(ec_app, query, contexts_data_for_llm_query, config)

    kwargs = {
        "model": model,
        "temperature": config.temperature,
        "max_tokens": config.max_tokens,
        "model_kwargs": {"top_p": config.top_p} if config.top_p else {},
        "streaming": stream,
        "callbacks": [callback],
        "api_key": config.api_key,
    }

    llm_task = asyncio.create_task(ChatOpenAI(**kwargs).agenerate(messages=[messages]))

    generated_answer = ""
    try:
        yield sources_str
        async for token in callback.aiter():
            yield token
            generated_answer += token
    except Exception as e:
        logging.exception(f"Caught exception: {e}")
    finally:
        # add conversation in memory
        ec_app.llm.add_history(ec_app.config.id, query, generated_answer, session_id=session_id)
        callback.done.set()
    await llm_task
