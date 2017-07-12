function camelToDash(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export default function style({ node, expr }, ...propertyNames) {
  if (!propertyNames.length) {
    return (list, { type: globalType, oldValue, changelog }) => {
      switch (globalType) {
        case 'modify':
          Object.keys(changelog).forEach((key) => {
            switch (changelog[key].type) {
              case 'delete':
                node.style.removeProperty(camelToDash(key));
                break;
              default:
                node.style.setProperty(camelToDash(key), list[key]);
            }
          });
          break;
        default:
          if (list) {
            if (process.env.NODE_ENV !== 'production' && typeof list !== 'object') {
              throw TypeError(`style: '${expr.evaluate}' must be an object: ${typeof list}`);
            }
            Object.keys(list).forEach(key => node.style.setProperty(camelToDash(key), list[key]));
          } else if (typeof oldValue === 'object' && oldValue !== null) {
            Object.keys(oldValue).forEach(key => node.style.removeProperty(camelToDash(key)));
          }
      }
    };
  }

  return (value) => {
    propertyNames.map(camelToDash).forEach((key) => {
      if (!value && value !== 0) {
        node.style.removeProperty(key);
      } else {
        node.style.setProperty(key, value);
      }
    });
  };
}