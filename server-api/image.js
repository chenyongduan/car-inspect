function deleteImage(carId, imageName) {
  return {
    endpoint: '/deleteImage',
    method: 'POST',
    data: {
      carId,
      imageName,
    },
  };
}

module.exports = {
  deleteImage,
};