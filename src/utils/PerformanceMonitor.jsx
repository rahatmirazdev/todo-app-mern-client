import React, { useEffect, useState } from 'react';

const PerformanceMonitor = ({ id, children }) => {
    const [renderCount, setRenderCount] = useState(0);

    useEffect(() => {
        setRenderCount(prev => prev + 1);
        console.log(`Component ${id} rendered ${renderCount + 1} times`);
    });

    return <>{children}</>;
};

export default PerformanceMonitor;

// Usage example (during development only):
// <PerformanceMonitor id="Login">
//   <Login />
// </PerformanceMonitor>
