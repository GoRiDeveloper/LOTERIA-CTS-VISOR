export const filterDate = (data: any) => {
  const filteredDate = data.map((document: any) => {
    for (const key in document) {
      if (
        typeof document[key] === 'string' &&
        document[key].includes('00:00:00')
      ) {
        document[key] = document[key].replace(' 00:00:00', '');
      }
    }
    return document;
  });
  return filteredDate;
};
