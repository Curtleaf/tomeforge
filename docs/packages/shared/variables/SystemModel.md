[**@tomeforge/shared v0.0.2**](../README.md)

***

[@tomeforge/shared](/packages/shared/README.md) / SystemModel

# Variable: SystemModel

> `const` **SystemModel**: `Model`\<\{ `author?`: `string` \| `null`; `configuration`: \{ `skills`: `DocumentArray`\<\{ `dataType`: `"string"` \| `"number"`; `name`: `string`; `order?`: `number` \| `null`; `skillId`: `number`; \}, `Subdocument`\<`ObjectId`, `any`, \{ `dataType`: `"string"` \| `"number"`; `name`: `string`; `order?`: `number` \| `null`; `skillId`: `number`; \}\> & `object`\>; `stats`: `DocumentArray`\<\{ `dataType`: `"string"` \| `"number"`; `name`: `string`; `order?`: `number` \| `null`; `statId`: `number`; \}, `Subdocument`\<`ObjectId`, `any`, \{ `dataType`: `"string"` \| `"number"`; `name`: `string`; `order?`: `number` \| `null`; `statId`: `number`; \}\> & `object`\>; \}; `description?`: `string` \| `null`; `name`: `string`; `rules`: \{ `diceRolling?`: \{ `dice`: `number`; `modifier?`: `number` \| `null`; `quantity`: `number`; `type`: `string`; \} \| `null`; \}; `systemId`: `number`; `version?`: `string` \| `null`; \}, \{ \}, \{ \}, \{ \}, `Document`\<`unknown`, \{ \}, \{ `author?`: `string` \| `null`; `configuration`: \{ `skills`: `DocumentArray`\<\{ `dataType`: `"string"` \| `"number"`; `name`: `string`; `order?`: `number` \| `null`; `skillId`: `number`; \}, `Subdocument`\<`ObjectId`, `any`, \{ `dataType`: `"string"` \| `"number"`; `name`: `string`; `order?`: `number` \| `null`; `skillId`: `number`; \}\> & `object`\>; `stats`: `DocumentArray`\<\{ `dataType`: `"string"` \| `"number"`; `name`: `string`; `order?`: `number` \| `null`; `statId`: `number`; \}, `Subdocument`\<`ObjectId`, `any`, \{ `dataType`: `"string"` \| `"number"`; `name`: `string`; `order?`: `number` \| `null`; `statId`: `number`; \}\> & `object`\>; \}; `description?`: `string` \| `null`; `name`: `string`; `rules`: \{ `diceRolling?`: \{ `dice`: `number`; `modifier?`: `number` \| `null`; `quantity`: `number`; `type`: `string`; \} \| `null`; \}; `systemId`: `number`; `version?`: `string` \| `null`; \}\> & `object` & `object` & `object`, `any`\>

Defined in: [packages/shared/src/models/system.ts:68](https://github.com/Curtleaf/tomeforge/blob/f49c646b792708514a254e18e40c9c35f28c3e79/packages/shared/src/models/system.ts#L68)

Mongoose model for tabletop game systems.
Represents a game system with configuration and rules.
