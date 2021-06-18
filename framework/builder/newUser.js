import faker from 'faker';

const PersonBuilder = function PersonBuilder() {
  this.addUserName = function addUserName() {
    this.userName = faker.internet.userName();
    return this;
  };
  this.addEmail = function addEmail() {
    this.email = faker.internet.email();
    return this;
  };
  this.addPassword = function addPassword() {
    this.password = faker.internet.password();
    return this;
  };
  this.generate = function generate() {
    const fields = Object.getOwnPropertyNames(this);
    const data = {};
    fields.forEach((fieldName) => {
      if (this[fieldName] && typeof this[fieldName] !== 'function') {
        data[fieldName] = this[fieldName];
      }
    });
    return data;
  };
};

export { PersonBuilder };
