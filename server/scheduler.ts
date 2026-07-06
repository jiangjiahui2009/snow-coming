import cron from 'node-cron';
import { syncAllResorts } from './sync.js';
import { getLastSyncTime } from './db.js';

export function startScheduler(): void {
  // Run immediately on startup
  console.log('[Scheduler] 启动时执行首次同步...');
  syncAllResorts().catch((err) => console.error('[Scheduler] 首次同步失败:', err));

  // Schedule every 6 hours: 0:00, 6:00, 12:00, 18:00
  cron.schedule('0 */6 * * *', () => {
    console.log('[Scheduler] 定时同步触发');
    syncAllResorts().catch((err) => console.error('[Scheduler] 定时同步失败:', err));
  });

  const lastSync = getLastSyncTime();
  console.log(`[Scheduler] 定时任务已启动 (每6小时) | 上次同步: ${lastSync || '无'}`);
}
