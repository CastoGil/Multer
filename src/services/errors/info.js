export const generateProductPropertiesError = (product) => {
  const requiredFields = [
    "title",
    "description",
    "price",
    "thumbnail",
    "code",
    "stock",
    "category",
  ];
  const missingFields = requiredFields.filter(
    (field) => !product.hasOwnProperty(field)
  );
  const missingFieldsString = missingFields.join(", ");
  return `One or more properties were incomplete or not valid. List of required properties: ${missingFieldsString}`;
};

export const generateProductIdError = ({ pid }) => {
  return `The Product ID property was incomplete or not valid. Required property: ${pid}`;
};

export const generatePropertiesError = ({ cid, pid }) => {
  return `One or more properties were incomplete or not valid. List of required properties: CartID: ${cid} or ProductID: ${pid}`;
};

export const generateCartIdError = ({ cid }) => {
  return `The Cart ID property was incomplete or not valid. Required property: ${cid}`;
};
export const generateUserError = (user) => {

 const requiredFields = [
    "first_name",
    "last_name",
    "age",
    "email",
    "password",
  ];
  const missingFields = requiredFields.filter(
    (field) => !user.hasOwnProperty(field)
  );
  const missingFieldsString = missingFields.join(", ");
  return `One or more properties were incomplete or not valid. List of required properties: ${missingFieldsString}`;
};
