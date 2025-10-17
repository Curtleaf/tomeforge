## Database migration best practices

### TomeForge MongoDB/Mongoose Migration Standards

**Note**: MongoDB is schema-less, but Mongoose provides schema validation. TomeForge currently does not have a formal migration system.

### Schema Changes

Since Mongoose schemas are defined in code (`packages/shared/src/models/`), schema changes are deployed as code changes:

1. **Update Schema**: Modify schema in `packages/shared/src/models/`
2. **Build Package**: Run `cd packages/shared && pnpm build`
3. **Test Locally**: Test with local MongoDB instance
4. **Deploy**: Deploy backend with updated schema

### Migration Considerations

- **Backward Compatibility**: MongoDB allows documents with different structures in same collection
- **Schema Evolution**: New required fields should have defaults or be added as optional first
- **Data Migrations**: Currently handled manually in MongoDB or via scripts
- **Index Creation**: Add indexes programmatically or via MongoDB Compass/shell
- **Version Control**: All schema changes tracked in git

### Recommended Practices

- **Add Fields as Optional**: Add new fields as optional, migrate data, then make required
- **Rename with Care**: Renaming fields requires data migration script
- **Remove Fields Gradually**: Mark deprecated, remove from schema, clean up data later
- **Test Schema Changes**: Test with sample data before deploying
- **Document Changes**: Update model documentation in `packages/shared/docs/models/`

### Future Considerations

Consider adding migration tools:
- `migrate-mongo` for MongoDB migrations
- Custom migration scripts in `apps/backend/src/migrations/`
- Migration tracking collection in MongoDB
