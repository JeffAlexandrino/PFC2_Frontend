import { Metric } from "web-vitals";

const reportWebVitals = (onPerfEntry?: (metrics: Metric) => void) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import("web-vitals").then(({ onCLS, onINP, onLCP }) => {
            onCLS(onPerfEntry);
            onINP(onPerfEntry);
            onLCP(onPerfEntry);
        });
    }
};

export default reportWebVitals;
