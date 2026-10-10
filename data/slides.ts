import type { SlideData } from "@/lib/types";
import { openingSlides } from "./opening";
import { fundamentalsSlides } from "./fundamentals";
import { coreSlides } from "./core";
import { workflowSlides } from "./workflow";
import { advancedSlides } from "./advanced";
import { wrapSlides } from "./wrap";
import { demoSlides } from "./demo";

// Set to true to append the component demo slides while testing.
const SHOW_DEMO = false;

export const slides: SlideData[] = [
  ...openingSlides, ...fundamentalsSlides, ...coreSlides, ...workflowSlides, ...advancedSlides, ...wrapSlides,
  ...(SHOW_DEMO ? demoSlides : []),
];
