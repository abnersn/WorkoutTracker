import { lazy, type ComponentType } from "react";
import { loadRemote } from "@module-federation/runtime";

// The remotes themselves are declared in rspack.config.ts (`remotes:`), not
// registered here, so Zephyr can point them at their deployed URLs at build
// time. `alias` is the key from that `remotes:` block.
export function lazyProvider<Props = unknown>(
  alias: string,
  exposeName: string,
): React.LazyExoticComponent<ComponentType<Props>> {
  return lazy(async () => {
    const mod = await loadRemote<{ default: ComponentType<Props> }>(
      `${alias}/${exposeName}`,
    );
    return { default: mod!.default };
  });
}
