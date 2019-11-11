const schema = {
  hero: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  
  userInfo: {
    email: {
      type: String,
      required: true
    },
    nickname: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    }
  }
}

module.exports = schema;