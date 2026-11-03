// src/features/dialogue/dialogueLibrary.ts
// Thư viện kịch bản hội thoại phong phú chuẩn Toán Lớp 1 (11 tình huống với nhiều biến thể ngẫu nhiên)

import type { IDialogueConversation, DialogueCategory } from '../../types/dialogue';

export const DIALOGUE_LIBRARY: Record<string, IDialogueConversation> = {
  // 1. CHÀO ĐÓN (GREETING)
  greeting_main: {
    id: 'greeting_main',
    title: 'Nữ Hoàng Chào Đón Ronie',
    category: 'greeting',
    startNodeId: 'g_1',
    nodes: {
      g_1: {
        id: 'g_1',
        characterId: 'queen',
        characterName: 'Nữ Hoàng Nhi Mami',
        text: 'Chào Ronie yêu quý của mẹ! Hôm nay con đã sẵn sàng cùng mẹ giải cứu Vương Quốc Toán Học chưa?',
        animation: 'greeting',
        nextDialogueId: 'g_2',
      },
      g_2: {
        id: 'g_2',
        characterId: 'ronie',
        characterName: 'Bé Ronie',
        text: 'Dạ con sẵn sàng rồi ạ! Hôm nay chúng mình sẽ phiêu lưu đến vùng đất nào vậy mẹ?',
        animation: 'celebrate',
        nextDialogueId: 'g_3',
      },
      g_3: {
        id: 'g_3',
        characterId: 'queen',
        characterName: 'Nữ Hoàng Nhi Mami',
        text: 'Các bạn thú ở Rừng Số và Thung Lũng đang chờ con đó. Chúng mình cùng xuất phát nhé!',
        animation: 'encouraging',
        nextDialogueId: null,
      },
    },
  },

  // 2. GIAO NHIỆM VỤ (QUEST ASSIGN)
  quest_assign_forest: {
    id: 'quest_assign_forest',
    title: 'Giao Nhiệm Vụ Rừng Số Kỳ Diệu',
    category: 'quest_assign',
    startNodeId: 'qa_1',
    nodes: {
      qa_1: {
        id: 'qa_1',
        characterId: 'queen',
        characterName: 'Nữ Hoàng Nhi Mami',
        text: 'Ronie ơi! Bạn Thỏ Trắng trong Rừng Số đang bị lạc và cần con đếm giúp những quả dâu tây đỏ mọng!',
        animation: 'talking',
        nextDialogueId: 'qa_2',
      },
      qa_2: {
        id: 'qa_2',
        characterId: 'ronie',
        characterName: 'Bé Ronie',
        text: 'Thật ạ mẹ? Con đếm số từ 1 đến 10 siêu nhanh luôn! Có phần thưởng sao vàng không mẹ?',
        animation: 'thinking',
        nextDialogueId: 'qa_3',
      },
      qa_3: {
        id: 'qa_3',
        characterId: 'queen',
        characterName: 'Nữ Hoàng Nhi Mami',
        text: 'Hoàn thành nhiệm vụ rồi con sẽ biết! Chúc Ronie của mẹ lên đường may mắn!',
        animation: 'laughing',
        nextDialogueId: 'qa_4',
      },
      qa_4: {
        id: 'qa_4',
        characterId: 'ronie',
        characterName: 'Bé Ronie',
        text: 'Bắn tơ nhện xuất phát thôi nào! Vút vút!',
        animation: 'web_shoot',
        nextDialogueId: null,
      },
    },
  },

  // 3. BẮT ĐẦU NHIỆM VỤ (QUEST START)
  quest_start_action: {
    id: 'quest_start_action',
    title: 'Hiệp Sĩ Sẵn Sàng Ra Trận',
    category: 'quest_start',
    startNodeId: 'qs_1',
    nodes: {
      qs_1: {
        id: 'qs_1',
        characterId: 'rabbit',
        characterName: 'Thỏ Con Tinh Nghịch',
        text: 'A, Hiệp sĩ Ronie tới rồi! Hãy giúp tớ giải bài toán trên cây nấm phát sáng này nhé!',
        animation: 'greeting',
        nextDialogueId: 'qs_2',
      },
      qs_2: {
        id: 'qs_2',
        characterId: 'ronie',
        characterName: 'Bé Ronie',
        text: 'Bạn Thỏ yên tâm, tớ sẽ quan sát thật kỹ và tìm ra đáp án đúng ngay!',
        animation: 'attack',
        nextDialogueId: null,
      },
    },
  },

  // 4. TRẢ LỜI ĐÚNG (CORRECT)
  correct_reaction: {
    id: 'correct_reaction',
    title: 'Nữ Hoàng & Ronie Ăn Mừng Trả Lời Đúng',
    category: 'answer_correct',
    startNodeId: 'c_1',
    nodes: {
      c_1: {
        id: 'c_1',
        characterId: 'queen',
        characterName: 'Nữ Hoàng Nhi Mami',
        text: 'Tuyệt vời quá Ronie ơi! Con đã tính đúng một trăm phần trăm rồi!',
        animation: 'clapping',
        nextDialogueId: 'c_2',
      },
      c_2: {
        id: 'c_2',
        characterId: 'ronie',
        characterName: 'Bé Ronie',
        text: 'Hura! Con làm được rồi! Tơ sao của con đang phát sáng rực rỡ nè mẹ!',
        animation: 'victory',
        nextDialogueId: null,
      },
    },
  },

  // 5. TRẢ LỜI CHƯA ĐÚNG / THỬ LẠI (TRY AGAIN)
  try_again_reaction: {
    id: 'try_again_reaction',
    title: 'Nữ Hoàng Động Viên Khi Bé Làm Chưa Đúng',
    category: 'answer_wrong',
    startNodeId: 'ta_1',
    nodes: {
      ta_1: {
        id: 'ta_1',
        characterId: 'queen',
        characterName: 'Nữ Hoàng Nhi Mami',
        text: 'Đừng buồn con nhé! Chúng mình cùng quan sát lại đề bài và đếm thật chậm rãi nào.',
        animation: 'encouraging',
        nextDialogueId: 'ta_2',
      },
      ta_2: {
        id: 'ta_2',
        characterId: 'ronie',
        characterName: 'Bé Ronie',
        text: 'Dạ, con sẽ thử lại! Lần này con nhất định làm đúng cho mẹ xem!',
        animation: 'pull',
        nextDialogueId: null,
      },
    },
  },

  // 6. GỢI Ý THÔNG MINH (HINT)
  hint_guidance: {
    id: 'hint_guidance',
    title: 'Nữ Hoàng Gợi Ý Dịu Dàng',
    category: 'hint',
    startNodeId: 'h_1',
    nodes: {
      h_1: {
        id: 'h_1',
        characterId: 'queen',
        characterName: 'Nữ Hoàng Nhi Mami',
        text: 'Mẹ bật mí nhé: Bé hãy dùng ngón tay chỉ vào từng quả táo để đếm từ 1 trở đi nhé!',
        animation: 'talking',
        nextDialogueId: 'h_2',
      },
      h_2: {
        id: 'h_2',
        characterId: 'ronie',
        characterName: 'Bé Ronie',
        text: 'A, con hiểu rồi! Con đếm được ngay đây mẹ ơi!',
        animation: 'surprised',
        nextDialogueId: null,
      },
    },
  },

  // 7. CHIẾN THẮNG MÀN CHƠI (VICTORY)
  victory_celebration: {
    id: 'victory_celebration',
    title: 'Khúc Ca Chiến Thắng Hoàn Thành Màn Chơi',
    category: 'victory',
    startNodeId: 'v_1',
    nodes: {
      v_1: {
        id: 'v_1',
        characterId: 'ronie',
        characterName: 'Bé Ronie',
        text: 'Chiến thắng rồi! Con đã thu thập đủ 3 Ngôi Sao Tri Thức lấp lánh rồi mẹ ơi!',
        animation: 'celebrate',
        nextDialogueId: 'v_2',
      },
      v_2: {
        id: 'v_2',
        characterId: 'queen',
        characterName: 'Nữ Hoàng Nhi Mami',
        text: 'Mẹ tự hào về con lắm Ronie! Cả Vương Quốc đang reo hò chúc mừng hiệp sĩ nhí của mẹ!',
        animation: 'rewarding',
        nextDialogueId: null,
      },
    },
  },

  // 8. CẦN CỐ GẮNG (DEFEAT / CHEER UP)
  defeat_encouragement: {
    id: 'defeat_encouragement',
    title: 'Nữ Hoàng Khích Lệ Bé Vượt Khó',
    category: 'defeat',
    startNodeId: 'd_1',
    nodes: {
      d_1: {
        id: 'd_1',
        characterId: 'ronie',
        characterName: 'Bé Ronie',
        text: 'Ôi bài toán này hơi hóc búa mẹ ơi, con chưa qua màn được...',
        animation: 'sad',
        nextDialogueId: 'd_2',
      },
      d_2: {
        id: 'd_2',
        characterId: 'queen',
        characterName: 'Nữ Hoàng Nhi Mami',
        text: 'Không sao đâu con yêu! Người anh hùng dũng cảm là người không bao giờ bỏ cuộc. Mẹ con mình cùng thử lại nhé!',
        animation: 'encouraging',
        nextDialogueId: null,
      },
    },
  },

  // 9. TRAO THƯỞNG HOÀNG GIA (REWARDING)
  reward_ceremony: {
    id: 'reward_ceremony',
    title: 'Lễ Trao Thưởng Tại Lâu Đài',
    category: 'rewarding',
    startNodeId: 'r_1',
    nodes: {
      r_1: {
        id: 'r_1',
        characterId: 'queen',
        characterName: 'Nữ Hoàng Nhi Mami',
        text: 'Nhân danh Nữ Hoàng Vương Quốc Toán Học, ta trao tặng Ronie Vương Miện Nhí và Áo Choàng Sao Vàng!',
        animation: 'rewarding',
        nextDialogueId: 'r_2',
      },
      r_2: {
        id: 'r_2',
        characterId: 'ronie',
        characterName: 'Bé Ronie',
        text: 'Ôi đẹp quá! Cảm ơn Nữ hoàng mẹ yêu! Con sẽ mặc áo choàng đi cứu thêm nhiều bạn nhỏ nữa!',
        animation: 'victory',
        nextDialogueId: null,
      },
    },
  },

  // 10. ĐỘNG VIÊN HÀNG NGÀY (DAILY ENCOURAGEMENT)
  daily_cheer: {
    id: 'daily_cheer',
    title: 'Lời Nhắn Nhủ Yêu Thương',
    category: 'encouragement',
    startNodeId: 'dc_1',
    nodes: {
      dc_1: {
        id: 'dc_1',
        characterId: 'bear',
        characterName: 'Gấu Con Tròn Trĩnh',
        text: 'Ronie ơi! Bác có mật ong ngọt ngào cho cháu nè, giải xong bài toán chúng mình cùng ăn nhé!',
        animation: 'greeting',
        nextDialogueId: 'dc_2',
      },
      dc_2: {
        id: 'dc_2',
        characterId: 'ronie',
        characterName: 'Bé Ronie',
        text: 'Dạ vâng ạ! Bác Gấu đợi cháu một lát, cháu làm phép cộng xong ngay thôi!',
        animation: 'run',
        nextDialogueId: null,
      },
    },
  },

  // 11. MỞ KHÓA VÙNG MỚI (NEW ZONE UNLOCKED)
  new_zone_unlock: {
    id: 'new_zone_unlock',
    title: 'Khai Phá Vùng Đất Mới',
    category: 'new_zone',
    startNodeId: 'nz_1',
    nodes: {
      nz_1: {
        id: 'nz_1',
        characterId: 'dragon',
        characterName: 'Rồng Con Đuôi Lửa',
        text: 'Hoan hô! Cánh cửa Hang Kho Báu và Cầu Vồng Hình Học đã mở toang rồi!',
        animation: 'greeting',
        nextDialogueId: 'nz_2',
      },
      nz_2: {
        id: 'nz_2',
        characterId: 'ronie',
        characterName: 'Bé Ronie',
        text: 'Tuyệt đỉnh luôn! Chúng mình cùng bay qua cầu vồng khám phá các khối lập phương nào!',
        animation: 'jump',
        nextDialogueId: null,
      },
    },
  },
};

/**
 * Thư viện các câu nói ngắn gọn ngẫu nhiên thay thế cho từng tình huống (Random Quick Phrases)
 */
export const RANDOM_PHRASES: Record<DialogueCategory, string[]> = {
  greeting: [
    'Chào mừng con yêu! Hôm nay chúng mình lại cùng học toán nhé!',
    'Ronie của mẹ hôm nay trông thật nhanh nhẹn và rạng rỡ!',
    'Một ngày mới tuyệt vời tại Vương Quốc Toán Học đã bắt đầu!',
    'Mẹ luôn ở bên con! Cùng Ronie khám phá những con số kỳ diệu nào!',
  ],
  quest_assign: [
    'Mẹ có một thử thách số học rất thú vị dành riêng cho con này!',
    'Các bạn nhỏ trong thung lũng đang rất cần trí thông minh của Ronie!',
    'Nhiệm vụ mới đã sẵn sàng trên bàn ngai vàng rồi đấy con yêu!',
    'Hãy mang vinh quang và những ngôi sao vàng về cho lâu đài nhé!',
  ],
  quest_start: [
    'Bắn tơ nhện xuất phát thôi nào Ronie!',
    'Một, hai, ba, lên đường giải cứu muôn loài!',
    'Tớ đã sẵn sàng chinh phục câu hỏi toán học này rồi!',
    'Hiệp sĩ nhí tự tin bước vào đấu trường tri thức!',
  ],
  answer_correct: [
    'Đúng rồi! Bé Ronie thông minh tuyệt đỉnh!',
    'Xuất sắc quá! Con tính nhanh như chớp vậy!',
    'Chính xác một trăm phần trăm! Thêm một ngôi sao vàng rực rỡ!',
    'Hoan hô! Nữ hoàng rất vui vì con làm đúng ngay lần đầu!',
  ],
  answer_wrong: [
    'Gần đúng rồi con ơi! Chúng mình cùng nhìn kỹ lại một chút nhé!',
    'Đừng lo lắng Ronie nhé, anh hùng nào cũng cần kiên trì luyện tập!',
    'Cố lên con! Đếm lại từ đầu là ra đáp án chuẩn xác ngay thôi!',
    'Một chút nhầm lẫn nhỏ thôi mà, thử lại lần nữa nhé bé yêu!',
  ],
  hint: [
    'Mẹ gợi ý nhé: Hãy chú ý màu sắc và hình dạng của từng đồ vật!',
    'Hãy đếm ngón tay từ số nhỏ đến số lớn nhé con!',
    'Kim ngắn màu đỏ chỉ giờ, kim dài màu xanh chỉ phút đó con!',
    'Nhìn vào chiếc cân thăng bằng xem bên nào nhiều hơn nhé!',
  ],
  victory: [
    'Chiến thắng huy hoàng! Cả Vương Quốc reo hò vinh danh Ronie!',
    'Hura! Bé đã vượt qua màn chơi với số điểm thật cao!',
    'Tuyệt vời ông mặt trời! Con xứng đáng nhận trọn 3 Ngôi Sao Tri Thức!',
    'Vinh quang thuộc về Hiệp Sĩ Nhện Nhí Ronie dũng cảm!',
  ],
  defeat: [
    'Không sao cả con yêu! Thất bại là mẹ của thành công!',
    'Nghỉ ngơi uống một ngụm nước rồi mẹ con mình làm lại nhé!',
    'Ronie không bao giờ bỏ cuộc đúng không nào? Cố lên con!',
    'Mỗi lần thử lại là một lần con học thêm điều mới mẻ!',
  ],
  rewarding: [
    'Phần thưởng xứng đáng cho nỗ lực học tập chăm chỉ của con!',
    'Nữ hoàng trao tặng con chiếc vương miện tri thức lấp lánh!',
    'Mở chiếc rương vàng ra xem mẹ tặng con món quà gì nào!',
    'Chúc mừng con đã mở khóa thêm một bộ trang phục siêu nhân mới!',
  ],
  encouragement: [
    'Con làm rất tốt rồi, chỉ cần chăm chỉ thêm một chút xíu nữa thôi!',
    'Mẹ tin chắc chắn Ronie sẽ giải được bài toán này!',
    'Mỗi bài toán con giải được là một nụ cười rạng rỡ của muôn loài!',
    'Tự tin lên con yêu, mẹ luôn dõi theo từng bước chân của con!',
  ],
  new_zone: [
    'Khai phá thành công! Cánh cổng vùng đất mới đã mở ra!',
    'Cầu vồng bảy sắc lung linh đang chào đón bước chân Ronie!',
    'Một thế giới số học mới lạ và kỳ thú đang chờ con khám phá!',
    'Tuyệt đỉnh! Con đã thắp sáng ngọn hải đăng của vùng đất tiếp theo!',
  ],
};

/**
 * Lấy ngẫu nhiên câu thoại ngắn theo tình huống
 */
export function getRandomPhrase(category: DialogueCategory): string {
  const phrases = RANDOM_PHRASES[category];
  if (!phrases || phrases.length === 0) return 'Cố lên Ronie!';
  const idx = Math.floor(Math.random() * phrases.length);
  return phrases[idx];
}
