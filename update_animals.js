import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/results.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const updates = [
  { type: 'VSAT', title: '폭주기관차 토끼', emoji: '🐰' },
  { type: 'VSAN', title: '본능 100% 여우', emoji: '🦊' },
  { type: 'VSRT', title: '안목 1티어 부엉이', emoji: '🦉' },
  { type: 'VSRN', title: '프로 효율러 고양이', emoji: '😼' },
  { type: 'VMAT', title: '방구석 무드디렉터 베어', emoji: '🐻' },
  { type: 'VMAN', title: '도파민 서퍼 미어캣', emoji: '🦦' },
  { type: 'VMRT', title: '침대 위 미식가 펭귄', emoji: '🐧' },
  { type: 'VMRN', title: '사골국 순정 판다', emoji: '🐼' },
  { type: 'FSAT', title: '풀착장 우주 퍼그', emoji: '🐶' },
  { type: 'FSAN', title: '전두엽 풀악셀 치타', emoji: '🐆' },
  { type: 'FSRT', title: '템빨 마법사 댕댕이', emoji: '🐕' },
  { type: 'FSRN', title: '자연인 몽상가 나무늘보', emoji: '🦥' },
  { type: 'FMAT', title: '세계관 창조주 고양이', emoji: '🐈' },
  { type: 'FMAN', title: '무한리필 몽상가 햄스터', emoji: '🐹' },
  { type: 'FMRT', title: '망상 끝판왕 사자', emoji: '🦁' },
  { type: 'FMRN', title: '슬로우 모션 거북이', emoji: '🐢' }
];

updates.forEach(({type, title, emoji}) => {
  const regex = new RegExp(`(type:\\s*['"]${type}['"],\\s*\\n\\s*title:\\s*['"]).*?(['"],\\s*\\n\\s*emoji:\\s*['"]).*?(['"],\\s*\\n\\s*femaleTitle:\\s*['"]).*?(['"],\\s*\\n\\s*femaleEmoji:\\s*['"]).*?(['"])`, 'g');
  content = content.replace(regex, `$1${title}$2${emoji}$3${title}$4${emoji}$5`);
});

fs.writeFileSync(filePath, content);
console.log('Results updated successfully!');
