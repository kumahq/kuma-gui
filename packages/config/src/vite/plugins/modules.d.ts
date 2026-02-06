declare module '*.yaml' {
  const value: Record<string, any>
  export default value
}
declare module '*.yml' {
  const value: Record<string, any>
  export default value
}

