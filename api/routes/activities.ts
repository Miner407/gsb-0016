import { Router, type Request, type Response } from 'express';
import { dataStore } from '../store/dataStore.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const activities = dataStore.getAllActivities();
  res.json({ success: true, data: activities });
});

router.get('/:id', (req: Request, res: Response) => {
  const activity = dataStore.getActivityById(req.params.id);
  if (!activity) {
    return res.status(404).json({ success: false, error: '活动不存在' });
  }
  res.json({ success: true, data: activity });
});

router.post('/', (req: Request, res: Response) => {
  const { title, description, location, startTime, endTime, maxParticipants, status } = req.body;
  if (!title || !location || !startTime || !endTime || !maxParticipants) {
    return res.status(400).json({ success: false, error: '缺少必填字段' });
  }
  const activity = dataStore.createActivity({
    title,
    description: description || '',
    location,
    startTime,
    endTime,
    maxParticipants: Number(maxParticipants),
    status: status || 'recruiting',
  });
  res.status(201).json({ success: true, data: activity });
});

router.put('/:id', (req: Request, res: Response) => {
  const updated = dataStore.updateActivity(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: '活动不存在' });
  }
  res.json({ success: true, data: updated });
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = dataStore.deleteActivity(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: '活动不存在' });
  }
  res.json({ success: true });
});

router.get('/:id/registrations', (req: Request, res: Response) => {
  const activity = dataStore.getActivityById(req.params.id);
  if (!activity) {
    return res.status(404).json({ success: false, error: '活动不存在' });
  }
  const registrations = dataStore.getRegistrations(req.params.id);
  res.json({ success: true, data: registrations });
});

router.post('/:id/register', (req: Request, res: Response) => {
  const { userName, userPhone } = req.body;
  if (!userName || !userPhone) {
    return res.status(400).json({ success: false, error: '请填写姓名和手机号' });
  }
  const result = dataStore.registerForActivity(req.params.id, userName, userPhone);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }
  const activity = dataStore.getActivityById(req.params.id);
  res.status(201).json({ success: true, data: result.data, activity });
});

router.delete('/:id/register/:registrationId', (req: Request, res: Response) => {
  const result = dataStore.cancelRegistration(req.params.id, req.params.registrationId);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }
  const activity = dataStore.getActivityById(req.params.id);
  res.json({ success: true, activity });
});

export default router;
