# Intura AI Node

> ⚠️ **BETA WARNING**: This SDK is currently in beta. APIs may change without notice and additional features are still in development. Use with caution in production environments.
>
> If you encounter any issues, please contact developer@intura.co

## Installation

```bash
npm install intura-ai-node
```

## Quick Start

```javascript
const { InturaClient } = require('intura-ai-node');

// Initialize the client
const client = new InturaClient({
  apiKey: 'YOUR_INTURA_API_KEY_HERE'
});

const result = await client.invoke({
  experiment_id: "YOUR_EXPERIMENT_ID",
  features: {
    // Your feature values here
    user_id: "USER_12345"
  },
  messages: [
    {
      role: "human",
      content: "Your message here"
    }
  ]
});

// Start using the SDK
```

## Core Concepts

The Intura SDK provides a streamlined interface for interacting with the Intura API, allowing you to run experiments and generate inferences.

## Authentication

To use the SDK, you'll need an API key from your Intura dashboard.

```javascript
const client = new InturaClient({
  apiKey: 'YOUR_API_KEY_HERE',
  // Optional: Override the base URL
  // baseURL: 'https://api.intura.com/v1'
});
```

## The `invoke` Function

The `invoke` function is the primary method for generating inferences from your experiments. This section provides detailed information on how to use it effectively.

### Basic Usage

```javascript
const result = await client.invoke({
  experiment_id: "YOUR_EXPERIMENT_ID",
  features: {
    // Your feature values here
    user_id: "12345"
  },
  messages: [
    {
      role: "human",
      content: "Your message here"
    }
  ]
});
```

### Parameters

The `invoke` function accepts an object with the following properties:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `experiment_id` | string | Yes | The ID of the experiment to run |
| `features` | object | Yes | Key-value pairs of features used for experiment routing |
| `messages` | array | Yes | Array of message objects with `role` and `content` properties |
| `max_inferences` | number | No | Maximum number of inferences to generate (default: 1) |

### Message Format

Each message in the `messages` array should have:

- `role`: Either "human" or "assistant"
- `content`: The text content of the message

### Example

```javascript
const inferenceResult = await client.invoke({
  experiment_id: "86d77e66-444e-43b9-a9cf-c17dbfa9ad31",
  features: {
    user_id: "12345"
  },
  messages: [{
    role: "human",
    content: "say hi to me"
  }],
  max_inferences: 2
});
```

## Advanced Usage

### Setting a Custom Base URL

For testing or using different environments:

```javascript
const client = new InturaClient({
  apiKey: 'YOUR_API_KEY_HERE',
  baseURL: 'https://test-api.intura.com/v1'
});
```

### Multiple Inferences

To generate multiple inferences from different variants:

```javascript
const result = await client.invoke({
  experiment_id: "YOUR_EXPERIMENT_ID",
  features: {
    user_id: "12345"
  },
  messages: [{
    role: "human",
    content: "What's the weather like?"
  }],
  max_inferences: 3  // Get up to 3 different responses
});
```

### Working with Chat History

To maintain conversation context across multiple turns, include the full message history:

```javascript
// First interaction
const firstResponse = await client.invoke({
  experiment_id: "YOUR_EXPERIMENT_ID",
  features: {
    user_id: "12345"
  },
  messages: [{
    role: "human",
    content: "What can you tell me about machine learning?"
  }]
});

// Follow-up interaction with chat history
const secondResponse = await client.invoke({
  experiment_id: "YOUR_EXPERIMENT_ID",
  features: {
    user_id: "12345"
  },
  messages: [
    {
      role: "human",
      content: "What can you tell me about machine learning?"
    },
    {
      role: "assistant",
      content: "Machine learning is a branch of artificial intelligence that focuses on building systems that learn from data."
    },
    {
      role: "human",
      content: "How does it relate to deep learning?"
    }
  ]
});

// Continue the conversation with full history
const thirdResponse = await client.invoke({
  experiment_id: "YOUR_EXPERIMENT_ID",
  features: {
    user_id: "12345"
  },
  messages: [
    {
      role: "human",
      content: "What can you tell me about machine learning?"
    },
    {
      role: "assistant",
      content: "Machine learning is a branch of artificial intelligence that focuses on building systems that learn from data."
    },
    {
      role: "human",
      content: "How does it relate to deep learning?"
    },
    {
      role: "assistant",
      content: "Deep learning is a subset of machine learning that uses neural networks with many layers to analyze various factors of data."
    },
    {
      role: "human",
      content: "Give me an example application."
    }
  ]
});
```