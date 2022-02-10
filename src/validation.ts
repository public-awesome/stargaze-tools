export const checkFiles = (images: string[], metadata: string[]) => {
  // Check images length is equal to metadata length
  if (images.length !== metadata.length) {
    throw Error("Images files must have matching number of metadata files");
  }

  function parseFileName(path: string | null): string {
    // Check file name is not null
    if (!path) {
      throw Error("File cannot be null");
    }

    // Extract fileName from path
    const fileName = path.match(
      /([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.gif|.json)$/i
    )![1];

    // Check that file name is an Integer
    if (isNaN(parseInt(fileName, 10))) {
      throw Error("Filenames must be numbers");
    }
    return fileName;
  }

  // Check each image is sequentially named with a number and has a matching metadata file
  for (let i = 0; i < images.length; i++) {
    let image = parseFileName(images[i]);
    let json = parseFileName(metadata[i]);
    if (image !== json) {
      throw Error("Images must have matching JSON files");
    }
    if (i !== 0) {
      let previousImage = parseFileName(images[i - 1]);
      if (image < previousImage) {
        throw Error("Images must be sequential");
      }
    }
  }
};
