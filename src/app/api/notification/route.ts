import { adminDB, FieldValue } from '@/lib/firebase/admin';
import { getMessaging } from 'firebase-admin/messaging';

export async function POST(request: Request) {
    try {
        const { matchId, userId, token } = await request.json();
        console.log('Received request:', { userId, token });

        const adminMessaging = getMessaging();

        // 매치 알림 저장
        await adminDB.collection('matchNotifications').add({
            matchId,
            userId,
            token,
            createdAt: FieldValue.serverTimestamp(),
        });

        // FCM 토큰 업데이트
        await adminDB
            .collection('users')
            .doc(userId)
            .update({
                fcmTokens: FieldValue.arrayUnion(token),
                lastTokenUpdate: FieldValue.serverTimestamp(),
            });

        await adminMessaging.send({
            notification: {
                title: '알림 테스트',
                body: 'FCM 알림이 정상적으로 설정되었습니다.',
            },
            token: token,
        });

        return Response.json({ success: true });
    } catch (error: unknown) {
        console.error('Error details:', error);
        return Response.json({ error: error }, { status: 500 });
    }
}
