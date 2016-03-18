/**
 * Created by mdanilescu on 18/03/16.
 */
import AddonStore from "../../stores/AddonStore";

import DummyAddon from "./DummyAddon.react";

AddonStore.register("DummyAddon", DummyAddon);
AddonStore.register("");

export default AddonStore;