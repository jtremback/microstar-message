#### If this documentation is at all unclear, please do not hestitate to file an issue. Clarity is the primary goal of this project.

# microstar-message

This module creates messages for use in Microstar. These messages are designed to be 'chained' together, with each message containing the hash of the previous message. Each message is also signed by the author. These two properties allow a node receving a set of messages from any source to verify that they are:
- From a certain other node.
- There are no messages missing.

These properties provide an excellent base to build consensus systems, gossip networks, and cryptocurrencies.

### `.createEnvelope(settings, message, previous, callback)`

This creates a message with the cryptographic verifications and other information that Microstar uses.

#### Input message format
- `content` - The content of the message. This can be any JSON.
- `chain_id` - An identifier for the chain. This is important, because messages will be written and verified according to previous messages with this `chain_id`. Namespace this in the same way as `type`. Please follow a convention of prefixing the chain_id with the name of your module like this: `<name of module>:<chain id>`.
- `type` - The type of the message. Please prefix this in the same way as `chain_id`.
- `timestamp` - A timestamp of when the message was created. This is optional. If it is not present, it will be created.

```json
// Example input message
{
  "content": ["hello", "goodbye"],
  "chain_id": "module-name:myChain",
  "type": "module-name:test",
  "timestamp": 1418273900123
}
```

#### Output message format
The output message contains all of the properties in the input, along with several more:
- `previous` - The hash of the previous message in the chain.
- `public_key` - The public key of the creator of the message.
- `sequence` - The order of the message in the chain.
- `signature` - A signature of the message contents, created with the `public_key`.

```json
// Example output message
{
  "content": ["hello", "goodbye"],
  "chain_id": "module-name:myChain",
  "type": "module-name:test",
  "timestamp": 1418273900123,
  "sequence": 1,
  "previous": "LWTQmsJ1E9fu+gSXDM03ckBXieL9/K8Jl2claIRcC6FFX5WYd1ojDsgo6KK1GafCinq2lAQlsIeVtU4RSpYL1w==",
  "public_key": "N3DyaY1o1EmjPLUkRQRu41/g/xKe/CR/cCmatA78+zY=7XuCMMWN3y/r6DeVk7YGY8j/0rWyKm3TNv3S2cbmXKk=",
  "signature": "/v1TqoggUpzuFx5sJ5jirlQsBOpGQBb1DJwP4ue1S5LzqKXIvZvlFe/WOLjyQTKXkqw9uQo2NH7eJPq4E7HbAQ=="
}
```