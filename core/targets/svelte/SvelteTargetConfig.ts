export interface SvelteTargetConfig {
  componentBindings?: ComponentBindingConfig[];
}

export interface ComponentBindingConfig {
  elements: string | string[];
  event: string;
  targetProp: string;
}
