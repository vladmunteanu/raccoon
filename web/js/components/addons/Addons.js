import AddonStore from "../../stores/AddonStore";
import DummyAddon from "./DummyAddon.react";


AddonStore.register("DummyAddon", DummyAddon);
AddonStore.register("");

export default AddonStore;
