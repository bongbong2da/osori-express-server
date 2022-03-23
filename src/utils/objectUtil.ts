export const trimNull = (object : any) => {
  const trimmingObject = object;
  Object.keys(object).forEach((key) => {
    // eslint-disable-next-line no-param-reassign
    if (object[key] === null) delete trimmingObject[key];
  });
  return trimmingObject;
};

export const dummy = () => {

};
