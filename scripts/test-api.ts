

const BASE_URL = 'http://localhost:3001/api';

async function request<T>(path: string, options?: RequestInit): Promise<{ success: boolean; data?: T; error?: string }> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return res.json() as Promise<{ success: boolean; data?: T; error?: string }>;
}

function log(title: string, pass: boolean, message?: string) {
  const prefix = pass ? '✅ PASS' : '❌ FAIL';
  console.log(`${prefix} - ${title}`);
  if (message) {
    console.log(`   ${message}`);
  }
}

async function runTests() {
  console.log('\n========================================');
  console.log('  志愿活动管理系统 API 验证脚本');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  console.log('--- 基础接口测试 ---\n');

  const healthRes = await request('/health');
  const healthPass = healthRes.success === true;
  log('健康检查接口', healthPass);
  if (healthPass) { passed++; } else { failed++; }

  const listRes = await request('/activities');
  const listPass = listRes.success === true && Array.isArray(listRes.data);
  log('获取活动列表', listPass, listPass ? `共 ${listRes.data?.length} 个活动` : listRes.error);
  if (listPass) { passed++; } else { failed++; }

  console.log('\n--- 活动创建测试 ---\n');

  const future = (hours: number) => new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

  const createRes = await request('/activities', {
    method: 'POST',
    body: JSON.stringify({
      title: 'API测试活动',
      description: '这是一个通过自动化脚本创建的测试活动',
      location: '测试地点',
      startTime: future(24),
      endTime: future(26),
      maxParticipants: 3,
      status: 'recruiting',
    }),
  });
  const createPass = createRes.success === true && createRes.data?.id !== undefined;
  log('创建活动成功', createPass, createPass ? `活动ID: ${createRes.data?.id}` : createRes.error);
  if (createPass) { passed++; } else { failed++; }

  const activityId = createRes.data?.id;
  if (!activityId) {
    console.log('\n❌ 活动创建失败，终止后续测试\n');
    process.exit(1);
  }

  const createNoTitleRes = await request('/activities', {
    method: 'POST',
    body: JSON.stringify({
      location: '测试地点',
      startTime: future(24),
      endTime: future(26),
      maxParticipants: 10,
    }),
  });
  const createNoTitlePass = createNoTitleRes.success === false && createNoTitleRes.error !== undefined;
  log('创建活动 - 缺少必填字段拦截', createNoTitlePass, createNoTitlePass ? `错误: ${createNoTitleRes.error}` : '未正确拦截');
  if (createNoTitlePass) { passed++; } else { failed++; }

  console.log('\n--- 报名流程测试 ---\n');

  const reg1Res = await request(`/activities/${activityId}/register`, {
    method: 'POST',
    body: JSON.stringify({ userName: '测试用户1', userPhone: '13800000001' }),
  });
  const reg1Pass = reg1Res.success === true && reg1Res.data?.id !== undefined;
  log('报名成功 - 用户1', reg1Pass, reg1Pass ? `报名ID: ${reg1Res.data?.id}` : reg1Res.error);
  if (reg1Pass) { passed++; } else { failed++; }
  const reg1Id = reg1Res.data?.id;

  await request(`/activities/${activityId}/register`, {
    method: 'POST',
    body: JSON.stringify({ userName: '测试用户2', userPhone: '13800000002' }),
  });
  const reg3Res = await request(`/activities/${activityId}/register`, {
    method: 'POST',
    body: JSON.stringify({ userName: '测试用户3', userPhone: '13800000003' }),
  });
  const reg3Pass = reg3Res.success === true;
  log('报名成功 - 用户3（名额已满）', reg3Pass);
  if (reg3Pass) { passed++; } else { failed++; }

  const fullRes = await request(`/activities/${activityId}/register`, {
    method: 'POST',
    body: JSON.stringify({ userName: '测试用户4', userPhone: '13800000004' }),
  });
  const fullPass = fullRes.success === false && fullRes.error === '活动名额已满';
  log('满员拦截', fullPass, fullPass ? '正确拦截满员报名' : `错误: ${fullRes.error}`);
  if (fullPass) { passed++; } else { failed++; }

  const duplicateRes = await request(`/activities/${activityId}/register`, {
    method: 'POST',
    body: JSON.stringify({ userName: '测试用户1', userPhone: '13800000001' }),
  });
  const duplicatePass = duplicateRes.success === false && duplicateRes.error === '您已报名该活动';
  log('重复报名拦截', duplicatePass, duplicatePass ? '正确拦截重复报名' : `错误: ${duplicateRes.error}`);
  if (duplicatePass) { passed++; } else { failed++; }

  const activityAfterFull = await request(`/activities/${activityId}`);
  const statusFullPass = activityAfterFull.success === true && activityAfterFull.data?.status === 'full';
  log('满员后状态自动更新为「已满员」', statusFullPass, statusFullPass ? '状态正确更新' : `状态: ${activityAfterFull.data?.status}`);
  if (statusFullPass) { passed++; } else { failed++; }

  console.log('\n--- 取消报名测试 ---\n');

  const cancelRes = await request(`/activities/${activityId}/register/${reg1Id}`, {
    method: 'DELETE',
  });
  const cancelPass = cancelRes.success === true;
  log('取消报名成功', cancelPass, cancelPass ? '用户1已取消报名' : cancelRes.error);
  if (cancelPass) { passed++; } else { failed++; }

  const activityAfterCancel = await request(`/activities/${activityId}`);
  const remainingAfter = activityAfterCancel.data?.remainingSlots;
  const statusAfter = activityAfterCancel.data?.status;
  const cancelReleasePass = remainingAfter === 1 && statusAfter === 'recruiting';
  log('取消后名额释放、状态恢复招募中', cancelReleasePass, cancelReleasePass ? `剩余名额: ${remainingAfter}, 状态: ${statusAfter}` : `剩余名额: ${remainingAfter}, 状态: ${statusAfter}`);
  if (cancelReleasePass) { passed++; } else { failed++; }

  const registerAgainRes = await request(`/activities/${activityId}/register`, {
    method: 'POST',
    body: JSON.stringify({ userName: '测试用户4', userPhone: '13800000004' }),
  });
  const registerAgainPass = registerAgainRes.success === true;
  log('取消后新用户可报名', registerAgainPass, registerAgainPass ? '用户4报名成功' : registerAgainRes.error);
  if (registerAgainPass) { passed++; } else { failed++; }

  console.log('\n--- 报名名单测试 ---\n');

  const regListRes = await request(`/activities/${activityId}/registrations`);
  const regListPass = regListRes.success === true && Array.isArray(regListRes.data) && regListRes.data.length === 3;
  log('获取报名名单', regListPass, regListPass ? `共 ${regListRes.data?.length} 条记录` : `实际: ${regListRes.data?.length} 条`);
  if (regListPass) { passed++; } else { failed++; }

  console.log('\n--- 活动编辑测试 ---\n');

  const editRes = await request(`/activities/${activityId}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: 'API测试活动（已修改）',
      location: '新的测试地点',
      maxParticipants: 5,
    }),
  });
  const editPass = editRes.success === true && editRes.data?.title === 'API测试活动（已修改）';
  log('编辑活动成功', editPass, editPass ? `新标题: ${editRes.data?.title}` : editRes.error);
  if (editPass) { passed++; } else { failed++; }

  const editLowMaxRes = await request(`/activities/${activityId}`, {
    method: 'PUT',
    body: JSON.stringify({ maxParticipants: 2 }),
  });
  const editLowMaxPass = editLowMaxRes.success === false && editLowMaxRes.error?.includes('不能低于已报名人数');
  log('编辑活动 - 人数上限低于已报名人数拦截', editLowMaxPass, editLowMaxPass ? `错误: ${editLowMaxRes.error}` : '未正确拦截');
  if (editLowMaxPass) { passed++; } else { failed++; }

  const editStatusRes = await request(`/activities/${activityId}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'ended' }),
  });
  const editStatusPass = editStatusRes.success === true && editStatusRes.data?.status === 'ended';
  log('编辑活动状态为已结束', editStatusPass, editStatusPass ? `状态: ${editStatusRes.data?.status}` : `状态: ${editStatusRes.data?.status}`);
  if (editStatusPass) { passed++; } else { failed++; }

  const registerEndedRes = await request(`/activities/${activityId}/register`, {
    method: 'POST',
    body: JSON.stringify({ userName: '测试用户5', userPhone: '13800000005' }),
  });
  const registerEndedPass = registerEndedRes.success === false && registerEndedRes.error === '活动已结束，无法报名';
  log('已结束活动无法报名', registerEndedPass, registerEndedPass ? '正确拦截' : `错误: ${registerEndedRes.error}`);
  if (registerEndedPass) { passed++; } else { failed++; }

  console.log('\n--- 错误处理测试 ---\n');

  const notFoundRes = await request('/activities/nonexistent-id');
  const notFoundPass = notFoundRes.success === false && notFoundRes.error === '活动不存在';
  log('获取不存在的活动 - 返回404错误', notFoundPass, notFoundPass ? `错误: ${notFoundRes.error}` : '未正确处理');
  if (notFoundPass) { passed++; } else { failed++; }

  const registerNotFoundRes = await request('/activities/nonexistent-id/register', {
    method: 'POST',
    body: JSON.stringify({ userName: '测试', userPhone: '13800000000' }),
  });
  const registerNotFoundPass = registerNotFoundRes.success === false;
  log('向不存在的活动报名 - 返回错误', registerNotFoundPass, registerNotFoundPass ? `错误: ${registerNotFoundRes.error}` : '未正确处理');
  if (registerNotFoundPass) { passed++; } else { failed++; }

  console.log('\n========================================');
  console.log(`  测试完成: ${passed} 通过, ${failed} 失败`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('\n❌ 测试执行出错:', err);
  process.exit(1);
});
