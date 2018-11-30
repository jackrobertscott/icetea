export default {
  type(variableName: string, value: any, type: string, optional?: boolean) {
    if (value !== undefined) {
      if (typeof value !== type) {
        throw new Error(
          `Expected "${variableName}" to be of type "${type}" but was given "${typeof value}".`
        );
      }
    } else {
      if (!optional) {
        throw new Error(
          `Expected "${variableName}" to be provided but no value was given.`
        );
      }
    }
  },
  validate(validate: any, value: any, message: string): Error | null {
    if (validate.validateSync) {
      try {
        validate.validateSync(value);
      } catch (error) {
        return error;
      }
    } else if (typeof validate === 'function') {
      if (!validate(value)) {
        return new Error(message);
      }
    }
    return null;
  },
};
