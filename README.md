## SEOUL PANORAMA 2123

---

## 새로운 EC2 인스턴스에서 시작하기

### vscode에서 접속하기

### github 파일 내려받기

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

- 의존 패키지 설치

```bash
cd seoul_panorama_2123/
yarn
```

- 리액트 개발 서버 실행

```bash
yarn start
```
