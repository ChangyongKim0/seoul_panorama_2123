## SEOUL PANORAMA 2123

---

## 새로운 EC2 인스턴스에서 시작하기

### vscode에서 ssh로 접속하기

- `vscode Extensions`에서 `Remote - SSH` 설치하기
- `vscode Remote Explorer` 탭에서 `REMOTE > SSH`위에 마우스 올리고, 설정 버튼 클릭
- 팝업이 뜰텐데, 아무 적당한 파일 클릭하면 됨
- 드롭박스 `Dropbox\102. Web-Program\AWS_ec2_key` 폴더에 있는 맞는 키를 자신의 컴퓨터 사용자 폴더 바로 안에 복사해서 넣기
- 아래와 같이 내용 작성 후 저장
  - ([불라불라]는 불라불라에 해당하는 내용을 작성하라는 의미)

```
Host [별명]
  HostName [public pv4 주소(XX.XX.XX.XX 형식)]
  User ubuntu
  IdentityFile [키 위치(C:\Users\XX\XX.pem 형식)]
```

- `vscode Remote Explorer` 탭에서 `REMOTE`위에 마우스 올리고, 새로고침 버튼 클릭
- 새로 생긴 [별명]에 해당하는 탭을 클릭해서 열면 완료!
  - 초기 진입시는 os 설정(linux), 기타 설정(yes) 등이 있으니 적절하게 설정하면 됨

### github 파일 내려받아서 실행해보기

> 터미널 상의 위치가 `ubuntu(~)`인지 확인하고, 아래 있는 명령어의 경우 터미널창에 입력하면 된다.

- `ubuntu` 폴더 안에 `Developing` 폴더 생성
- 깃허브 코드 복제

```bash
cd Developing/
git clone https://github.com/ChangyongKim0/seoul_panorama_2123.git
```

- `~/Developing/seoul_panorama_2123/public` 폴더 안에 드롭박스 `Dropbox\102. Web-Program\@WEB_UNPUSHED_FOLDERS` 안에 있는 `img` 폴더를 옮겨 넣기
- Node Version Manage 다운 및 Node 14.18.1 버전 설치

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install 14.18.1
nvm use 14.18.1
```

- `yarn` 설치

```bash
npm install -g yarn
```

- 의존성 패키지 설치(오래 걸리니 좀 기다려주세요!)

```bash
cd seoul_panorama_2123/
yarn
```

- 리액트 개발 서버 실행

```bash
yarn start
```
