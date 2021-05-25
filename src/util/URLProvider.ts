interface Option {
  search: string,
  value: string
}

export default {
  getUrl(urls: Object, key: string, replaceOptions?: Array<Option>) {
    let url = urls[key];

    if (!url) {
      throw new Error('Url defined: ' + key + ' not found');
    }

    if (replaceOptions) {
      replaceOptions.forEach((replaceOption) => {
        if (!replaceOption.search) replaceOption.search = ':id';
        url = url.replace(replaceOption.search, replaceOption.value);
      });
    }

    return url;
  },
};
