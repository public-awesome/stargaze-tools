import fs from 'fs';

export const checkFiles = (images: string[], metadata: string[]) => {
  // Check images length is equal to metadata length
  if (images.length !== metadata.length) {
    throw Error('Images files must have matching number of metadata files');
  }

  function parseFileName(path: string | null): number {
    // Check file name is not null
    if (!path) {
      throw Error('File cannot be null');
    }

    // Extract fileName from path
    const fileName = path.match(
      /([a-zA-Z0-9\s_\\.\-:]+)(.png|.jpg|.gif|.json)?$/i
    )![1];

    // Check that file name is an Integer
    if (isNaN(parseInt(fileName, 10))) {
      throw Error('Filenames must be numbers. Invalid fileName: ' + fileName);
    }
    return parseInt(fileName, 10);
  }

  // We need to ensure that the files are numerically sorted (as opposed to lexicographically)
  const sortedImages = [...images.map(parseFileName)].sort(function (a, b) {
    return a - b;
  });
  const sortedMetadata = [...metadata.map(parseFileName)].sort(function (a, b) {
    return a - b;
  });
  let lastValue;
  // Check each image is sequentially named with a number and has a matching metadata file
  for (let i = 0; i < sortedImages.length; i++) {
    const image = sortedImages[i];
    const json = sortedMetadata[i];
    if (image !== json) {
      throw Error('Images must have matching JSON files');
    }
    if (lastValue && lastValue + 1 !== image) {
      throw Error('Images must be sequential');
    }
    lastValue = image;
  }
};

export const validateMetadata = (
  metadataBasePath: string,
  metadata: string[]
) => {
  metadata.map(async (file, index: number) => {
    // Read JSON file
    let metadata = JSON.parse(
      fs.readFileSync(`${metadataBasePath}/${file}`, 'utf8')
    );

    // iterate attributes,
    // confirm value and trait_type exists and trait type is string
    // else error
    metadata.attributes.map((item: any) => {
      if ('trait_type' in item) {
        if (typeof item.trait_type !== 'string' || !('value' in item)) {
          throw Error('Attribute trait_type must be a string and have a value');
        }
      }
    });
  });
};
