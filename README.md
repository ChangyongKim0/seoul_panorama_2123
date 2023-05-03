## SEOUL PANORAMA 2123

---

### 목차

1. [새로운 EC2 인스턴스에서 시작하기](https://github.com/ChangyongKim0/seoul_panorama_2123#%EC%83%88%EB%A1%9C%EC%9A%B4-ec2-%EC%9D%B8%EC%8A%A4%ED%84%B4%EC%8A%A4%EC%97%90%EC%84%9C-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0)
   1. [vscode에서 ssh로 접속하기](https://github.com/ChangyongKim0/seoul_panorama_2123#vscode%EC%97%90%EC%84%9C-ssh%EB%A1%9C-%EC%A0%91%EC%86%8D%ED%95%98%EA%B8%B0)
   1. [github 파일 내려받아서 실행해보기](https://github.com/ChangyongKim0/seoul_panorama_2123#github-%ED%8C%8C%EC%9D%BC-%EB%82%B4%EB%A0%A4%EB%B0%9B%EC%95%84%EC%84%9C-%EC%8B%A4%ED%96%89%ED%95%B4%EB%B3%B4%EA%B8%B0)
   1. [프론트엔드 서버 배포하기](https://github.com/ChangyongKim0/seoul_panorama_2123#github-%ED%8C%8C%EC%9D%BC-%EB%82%B4%EB%A0%A4%EB%B0%9B%EC%95%84%EC%84%9C-%EC%8B%A4%ED%96%89%ED%95%B4%EB%B3%B4%EA%B8%B0)

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

- `ubuntu` 폴더 안에 `Developing` 폴더 생성
- 깃허브 코드 복제

```bash
cd ~/Developing/
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

## 프론트엔드 개발 서버 배포하기

> 위에서 연결한 도메인에서 들어오는 요청에 따라 응답하는 프론트엔드 개발 서버를 배포해본다.

- `nginx` 설치

```bash
sudo apt-get install nginx
```

- `/etc/nginx/sites-available/` 폴더 안에 `[서버 별칭].conf` 파일 생성
- `[서버 별칭].conf` 파일 안에 아래 내용 입력
  - 참고 : `/home/ubuntu/Developing/seoul_panorama_2123/build` 는 빌드 파일의 위치를 가리킴

```text
server {
    listen 80;
    server_name [도메인 이름];

    location / {
        proxy_pass http://localhost:3400;
        proxy_set_header    Host              $host;
        proxy_set_header    X-Real-IP         $remote_addr;
        proxy_set_header    X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header    X-Client-Verify   SUCCESS;
        proxy_set_header    X-Client-DN       $ssl_client_s_dn;
        proxy_set_header    X-SSL-Subject     $ssl_client_s_dn;
        proxy_set_header    X-SSL-Issuer      $ssl_client_i_dn;
        proxy_set_header    X-Forwarded-Proto http;
        proxy_read_timeout 1800;
        proxy_connect_timeout 1800;
    }
}
```

- 서버 `conf` 파일 활성화

```bash
sudo ln -s /etc/nginx/sites-available/[서버 별칭].conf /etc/nginx/sites-enabled/[서버 별칭].conf
```

- `nginx` 시작

```bash
sudo service nginx start
```

## 프론트엔드 본 서버 배포하기

> 프론트엔드 빌드를 거쳐 본 서버를 배포한다.

- 프론트엔드 빌드 버전 생성

```bash
cd ~/Developing/seoul_panorama_2123/
yarn build
```

- `[서버 별칭].conf` 파일 안에 아래 내용 추가
  - 참고 : `/home/ubuntu/Developing/seoul_panorama_2123/build` 는 빌드 파일의 위치를 가리킴
  - 참고 : 위에서 사용한 도메인 외에 새로운 도메인이 필요

```text
server {
    listen 80;
    server_name [도메인 이름];

    root /home/ubuntu/Developing/seoul_panorama_2123/build;
    index index.html index.htm index.nginx-debian.html;
    location / {
        try_files $uri	$uri/	/index.html;
    }
}
```
