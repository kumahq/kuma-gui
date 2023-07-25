export interface KumaDpVersion {
  version: string;
  gitTag: string;
  gitCommit: string;
  buildDate: string;
  kumaCpCompatible: boolean;
}
export interface EnvoyVersion {
  version: string;
  build: string;
  kumaDpCompatible: boolean;
}
export interface Version {
  kumaDp:
  | KumaDpVersion
  | undefined;
  envoy:
  | EnvoyVersion
  | undefined;
  dependencies: { [key: string]: string };
}
export const KumaDpVersion = {
  fromJSON(object: any): KumaDpVersion {
    return {
      version: isSet(object.version) ? String(object.version) : '',
      gitTag: isSet(object.gitTag) ? String(object.gitTag) : '',
      gitCommit: isSet(object.gitCommit) ? String(object.gitCommit) : '',
      buildDate: isSet(object.buildDate) ? String(object.buildDate) : '',
      kumaCpCompatible: isSet(object.kumaCpCompatible) ? Boolean(object.kumaCpCompatible) : false,
    }
  },
}
export const EnvoyVersion = {
  fromJSON(object: any): EnvoyVersion {
    return {
      version: isSet(object.version) ? String(object.version) : '',
      build: isSet(object.build) ? String(object.build) : '',
      kumaDpCompatible: isSet(object.kumaDpCompatible) ? Boolean(object.kumaDpCompatible) : false,
    }
  },
}
export const Version = {
  fromJSON(object: any): Version {
    return {
      kumaDp: isSet(object.kumaDp) ? KumaDpVersion.fromJSON(object.kumaDp) : undefined,
      envoy: isSet(object.envoy) ? EnvoyVersion.fromJSON(object.envoy) : undefined,
      dependencies: isObject(object.dependencies)
        ? Object.entries(object.dependencies).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value)
          return acc
        }, {})
        : {},
    }
  },
}
function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined
}
