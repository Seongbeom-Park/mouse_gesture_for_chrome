[English page](README.en.md)

# 마우스 제스처 크롬 확장 프로그램
크롬 브라우저 용 마우스 제스처 확장 프로그램

## 사용법
1. 마우스 오른쪽 버튼을 누릅니다
1. 원하는 action을 실행하기 위해 마우스를 드래그합니다
1. 마우스 오른쪽 버튼을 뗍니다

## 설정
1. threshold angle (0 - 90)
    * 위, 아래, 왼쪽, 오른쪽 움직임으로 판단하는 각도 기준
1. sampling period (>= 1)
    * 마우스 이동을 감지하는 감도 (sensitive 값이 작을수록 쉽게 움직임을 감지)
1. page up/down scroll factor (>= 0)
    * page up/down 동작 시 페이지가 움직이는 정도
        * 예시: `0.9`
1. drag tracking activation
    * 마우스 우클릭 상태로 움직인 경로를 화면에 보여주는 기능 활성화 여부
1. action preview activation
    * 실행 될 action을 미리 보여주는 action preview 기능 활성화 여부
1. action preview text x offset from mouse curser
    * 마우스 커서로부터 action preview이 x 축 방향으로 떨어져 있는 거리 (단위: px)
1. action preview text y offset from mouse curser
    * 마우스 커서로부터 action preview이 y 축 방향으로 떨어져 있는 거리 (단위: px)
1. rules
    * 도메인 별 제스쳐에 따른 동작을 정의
    * 어떤 제스처에 일치하는 도메인이 있을 경우 해당 동작을 실행하며, 일치하는 도메인이 없는 경우 `*`에 해당하는 동작을 실행함
    1. domain
        * 규칙이 적용되는 도메인 이름
    1. gesture
        * 마우스의 움직임
        * 제스처는 U, D, L, R 글자들로 이루어져야 함
            * 가능한 예시: `U, LU, LR`
            * 불가능한 예시: `lu, UU, LDRR, a`
    1. action
        * closeTab: 사용 중인 탭 닫기
        * goBack: 이전 페이지로 이동
        * goBackOrCloseTab: 이전 페이지로 이동에 실패할 경우, 탭 닫기
        * goForward: 다음 페이지로 이동
        * scrollTop: 페이지의 가장 위로 이동
        * scrollBottom: 페이지의 가장 아래로 이동
        * pageDown: 스크롤을 내리기
        * pageUp: 스크롤을 올리기
        * restore: 가장 최근에 닫힌 탭 또는 창 다시 열기
        * keydown: 가상 키보드 누르기
            * keydown 선택 시 생성되는 `<input>` 태그를 클릭한 뒤, 사용하고자 하는 단축키를 입력
            * ctrl, shift, alt 키와 함께 영문 또는 숫자키
            * 예시: `Shift + 'N'`, `'1'`

## 피드백 보내기
1. 새로운 [이슈](https://github.com/Seongbeom-Park/mouse_gesture_for_chrome/issues)를 생성해 주세요
    * 개인정보와 같은 민감한 정보를 포함하지 않도록 주의해주세요

## 노트
1. `<iframe>` 태그 내부에서 동작하지 않음