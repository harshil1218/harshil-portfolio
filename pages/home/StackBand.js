import React from "react";
import StackScene, { SCENE_IN_HERO } from "@/components/common/stackScene/StackScene";
import useMediaQuery from "@/utils/useMediaQuery";

/**
 * Below laptop width the hero has no room for the 3D stack, so it gets its
 * own band straight under the ticker. On laptop the band is hidden in CSS and
 * the scene mounts in the hero instead — never both at once.
 */
const StackBand = () => {
  const sceneInHero = useMediaQuery(SCENE_IN_HERO);

  return (
    <>
      <section className="sect stack-band" aria-label="A request travelling through the stack">
        <div className="wrap rv">{sceneInHero === false ? <StackScene placement="band" /> : null}</div>
      </section>
      <div className="rule stack-band__rule" />
    </>
  );
};

export default StackBand;
