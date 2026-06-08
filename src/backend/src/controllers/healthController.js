import ApiResponse from '../utils/ApiResponse.js';

export const getHealth = (req, res) => {
  return ApiResponse.success(
    res,
    {
      status: 'UP',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      service: 'EA Sports FC 26 Player Analytics Platform Backend',
      environment: process.env.NODE_ENV || 'development'
    },
    'Health check completed successfully'
  );
};
