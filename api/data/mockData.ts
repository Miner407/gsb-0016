import type { Activity, Registration } from '../../shared/types.js';

const generateId = (): string => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const now = new Date();
const future = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
const past = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const initialActivities: Activity[] = [
  {
    id: generateId(),
    title: '社区公园环保清洁',
    description: '组织志愿者前往城市中央公园进行垃圾清理和环境保护宣传活动。包含垃圾分类知识讲解、实际清洁操作等环节。适合所有年龄段参与，提供清洁工具和饮用水。',
    location: '中央公园东门集合',
    startTime: future(3),
    endTime: future(3.25),
    maxParticipants: 20,
    status: 'recruiting',
    createdAt: past(1),
  },
  {
    id: generateId(),
    title: '敬老院关爱探访',
    description: '前往阳光敬老院看望老人，陪伴聊天、表演文艺节目、帮助打扫卫生。请提前报名以便安排分组，建议准备小节目或小礼物。',
    location: '阳光敬老院',
    startTime: future(7),
    endTime: future(7.2),
    maxParticipants: 15,
    status: 'recruiting',
    createdAt: past(2),
  },
  {
    id: generateId(),
    title: '流浪动物救助站志愿服务',
    description: '帮助流浪动物救助站进行日常照料工作，包括喂食、遛狗、清洁笼子、整理物资等。建议穿着耐脏衣物，有宠物经验者优先。',
    location: '爱心流浪动物救助站',
    startTime: future(5),
    endTime: future(5.3),
    maxParticipants: 10,
    status: 'full',
    createdAt: past(3),
  },
  {
    id: generateId(),
    title: '图书馆整理志愿服务',
    description: '协助市图书馆进行书籍分类整理、上架、借阅引导等工作。适合喜欢阅读和安静环境的志愿者。',
    location: '市图书馆三楼',
    startTime: past(5),
    endTime: past(4.7),
    maxParticipants: 12,
    status: 'ended',
    createdAt: past(10),
  },
  {
    id: generateId(),
    title: '血液中心无偿献血志愿服务',
    description: '在血液中心协助引导献血者、填写表格、照顾献血后休息人员等工作。同时可选择参与无偿献血（自愿）。',
    location: '市中心血液中心',
    startTime: future(10),
    endTime: future(10.25),
    maxParticipants: 8,
    status: 'recruiting',
    createdAt: past(1),
  },
];

export const initialRegistrations: Registration[] = [];

initialActivities.forEach((activity, idx) => {
  if (activity.status === 'full') {
    for (let i = 0; i < activity.maxParticipants; i++) {
      initialRegistrations.push({
        id: generateId(),
        activityId: activity.id,
        userName: `志愿者${idx + 1}-${i + 1}`,
        userPhone: `138****${String(1000 + i).slice(-4)}`,
        registeredAt: past(2),
      });
    }
  } else if (activity.status === 'ended') {
    for (let i = 0; i < Math.floor(activity.maxParticipants * 0.7); i++) {
      initialRegistrations.push({
        id: generateId(),
        activityId: activity.id,
        userName: `志愿者${idx + 1}-${i + 1}`,
        userPhone: `138****${String(2000 + i).slice(-4)}`,
        registeredAt: past(8),
      });
    }
  } else {
    for (let i = 0; i < Math.floor(activity.maxParticipants * 0.3); i++) {
      initialRegistrations.push({
        id: generateId(),
        activityId: activity.id,
        userName: `志愿者${idx + 1}-${i + 1}`,
        userPhone: `138****${String(3000 + i).slice(-4)}`,
        registeredAt: past(1),
      });
    }
  }
});
