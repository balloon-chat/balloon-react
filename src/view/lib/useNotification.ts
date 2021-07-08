import { useChatState } from 'src/data/redux/chat/selector';
import { useEffect } from 'react';
import { clearNotification, notify } from 'src/data/redux/chat/slice';
import { ChatNotificationTypes } from 'src/data/redux/chat/state';
import { useDispatch } from 'react-redux';

export const useChatNotification = () => {
  const dispatcher = useDispatch();
  const { topic } = useChatState();

  useEffect(() => {
    if (!topic) return;
    if (topic.branchTopics.length === 0) return;

    // コピーに対してソートを行わないと、エラーが起こる。
    const sorted = topic.branchTopics
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt);
    const latest = sorted[0];

    const branchIndex = topic.branchTopics.indexOf(latest);
    if (branchIndex === -1) return;

    if (Date.now() - 60 * 1000 < latest.createdAt) {
      // 10秒以内に派生した話題
      dispatcher(clearNotification());
      dispatcher(notify({
        type: ChatNotificationTypes.BRANCH_TOPIC_CREATED,
        title: '話題が広がりました！',
        message: `新しい話題『${latest.title}』が作成されました。`,
        payload: {
          title: latest.title,
          branch: branchIndex,
        },
      }));
    }
  }, [topic?.branchTopics]);
};
