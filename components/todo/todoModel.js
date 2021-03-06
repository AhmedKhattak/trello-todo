// const {
//     BaseModel
// } = require('../helpers/BaseModel');

const {
  Model,
  snakeCaseMappers
} = require('objection')

class Todo extends Model {
  static get columnNameMappers () {
    // If your columns are UPPER_SNAKE_CASE you can
    // use snakeCaseMappers({ upperCase: true })
    return snakeCaseMappers()
  }

  // Table name is the only required property.
  static get tableName () {
    return 'todos'
  }

  static get idColumn () {
    return 'todo_id'
  }

  // "$schema": "http://json-schema.org/schema#"
  static get jsonSchema () {
    return {

      type: 'object',
      required: ['title', 'description', 'user_id'],
      properties: {
        title: {
          type: 'string',
          minLength: 1,
          maxLength: 50
        },
        description: {
          type: 'string',
          minLength: 1,
          maxLength: 50
        },
        user_id: {
          type: 'integer'

        },
        group_id: {
          type: 'integer'
        }
      }
    }
  }
}

module.exports = Todo
