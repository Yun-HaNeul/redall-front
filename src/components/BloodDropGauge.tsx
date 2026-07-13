/**
 * 물방울 모양 게이지.
 * 위가 뾰족하고 아래가 둥근 물방울에, 비율만큼 아래에서 차오른다.
 */

interface Props {
  percent: number;
  label?: string;
  size?: number;
}

function BloodDropGauge({ percent, label = "헌혈률", size = 140 }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));

  // 물방울 실제 세로 범위 (path와 정확히 일치시킴)
  const dropTop = 10;
  const dropBottom = 190;   // 원호의 가장 아래점
  const dropHeight = dropBottom - dropTop;

  const fillHeight = (dropHeight * clamped) / 100;
  const fillY = dropBottom - fillHeight;

  // 물방울: 꼭대기(80,10) → 우측 곡선 → 아래 반원 → 좌측 곡선 → 꼭대기
  // 원 중심 (80,125), 반지름 65 → 아래점은 y=190
  const dropPath =
    "M80 10 " +
    "C80 10 145 90 145 125 " +
    "A65 65 0 1 1 15 125 " +
    "C15 90 80 10 80 10 Z";

  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 160 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="dropClip">
          <path d={dropPath} />
        </clipPath>
      </defs>

      {/* 배경 (연한 빨강) */}
      <rect
        x="0"
        y="0"
        width="160"
        height="200"
        fill="#FCEBEB"
        clipPath="url(#dropClip)"
      />

      {/* 채워지는 부분 - 아래에서 비율만큼 */}
      <rect
        x="0"
        y={fillY}
        width="160"
        height={dropBottom - fillY}
        fill="#E24B4A"
        clipPath="url(#dropClip)"
      />

      {/* 테두리 */}
      <path d={dropPath} fill="none" stroke="#A32D2D" strokeWidth="2.5" />

      {/* % 텍스트 */}
      <text
        x="80"
        y="120"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="30"
        fontWeight="500"
        fill="#A32D2D"
      >
        {clamped}%
      </text>

      {/* 라벨 */}
      <text
        x="80"
        y="148"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
        fill="#A32D2D"
      >
        {label}
      </text>
    </svg>
  );
}

export default BloodDropGauge;