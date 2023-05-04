# SEOUL PANORAMA 2123

---

### 목차

1. [새로운 EC2 인스턴스에서 시작하기](https://github.com/ChangyongKim0/seoul_panorama_2123#%EC%83%88%EB%A1%9C%EC%9A%B4-ec2-%EC%9D%B8%EC%8A%A4%ED%84%B4%EC%8A%A4%EC%97%90%EC%84%9C-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0)
   1. [vscode에서 ssh로 접속하기](https://github.com/ChangyongKim0/seoul_panorama_2123#vscode%EC%97%90%EC%84%9C-ssh%EB%A1%9C-%EC%A0%91%EC%86%8D%ED%95%98%EA%B8%B0)
   1. [github 파일 내려받아서 실행해보기](https://github.com/ChangyongKim0/seoul_panorama_2123#github-%ED%8C%8C%EC%9D%BC-%EB%82%B4%EB%A0%A4%EB%B0%9B%EC%95%84%EC%84%9C-%EC%8B%A4%ED%96%89%ED%95%B4%EB%B3%B4%EA%B8%B0)
   1. [방화벽 설정 및 서버 호스팅 시도](https://github.com/ChangyongKim0/seoul_panorama_2123#%EB%B0%A9%ED%99%94%EB%B2%BD-%EC%84%A4%EC%A0%95-%EB%B0%8F-%EC%84%9C%EB%B2%84-%ED%98%B8%EC%8A%A4%ED%8C%85-%EC%8B%9C%EB%8F%84)
   1. [도메인 연결하기](https://github.com/ChangyongKim0/seoul_panorama_2123#%EB%8F%84%EB%A9%94%EC%9D%B8-%EC%97%B0%EA%B2%B0%ED%95%98%EA%B8%B0)
   1. [HTTP SSL 인증서 발급받기](https://github.com/ChangyongKim0/seoul_panorama_2123#http-ssl-%EC%9D%B8%EC%A6%9D%EC%84%9C-%EB%B0%9C%EA%B8%89%EB%B0%9B%EA%B8%B0)
   1. [프론트엔드 개발 서버 배포하기](https://github.com/ChangyongKim0/seoul_panorama_2123#%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C-%EC%84%9C%EB%B2%84-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0)
   1. [프론트엔드 본 서버 배포하기](https://github.com/ChangyongKim0/seoul_panorama_2123#%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EB%B3%B8-%EC%84%9C%EB%B2%84-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0)
1. [EC2 재부팅 시 진행 필요 사항]()
   1. [Remote-SSH 세팅 변경]()
   1. [`tmux` 세팅하기]()

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
  HostName [public IPv4 주소(XX.XX.XX.XX 형식)]
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

### 방화벽 설정 및 서버 호스팅 시도

> EC2 방화벽 설정을 통해 HTTP, HTTPS 요청을 허용하고, `nginx`를 이용하여 샘플 서버를 호스팅한다.

- `22`, `80`, `443`번 포트 열고 방화벽 활성화하기
  - 묻는 질문에 `y`로 답변 진행

```bash
ufw allow 22 # SSH 연결 포트
ufw allow 80 # HTTP 연결 포트
ufw allow 443 # HTTPS 연결 포트
ufw enable
```

- `nginx` 설치
  - 설치시 모두 `Y`, `OK` 누르면 됨

```bash
sudo apt-get install nginx
```

- 방화벽 설정에서 HTTP, HTTPS 접근 허용
  - EC2에서 `보안 그룹 > launch-wizard > 인바운드 규칙` 접근
  - `인바운드 규칙 편집`클릭
  - `규칙 추가` 클릭
  - `사용자 유형` `HTTP`로 선택, `소스` `Anywhere-IPv4`로 선택
  - HTTP, HTTPS에 대해 Anywhere-IPv4, Anywhere IPv6, 총 4개 조합의 규칙 생성
  - `규칙 저장` 클릭
- `nginx` 시작

```bash
sudo service nginx start
```

- 웹 브라우저에서 공개 IP 주소 접속
  - HTTP 주소 : `[인스턴스 퍼블릭 IPv4 주소]:80`
  - HTTPS 주소 : `[인스턴스 퍼블릭 IPv4 주소]:443`

> HTTP 주소 접속 시 `Welcome to nginx!`라는 문구가 보이면 성공이다!

> HTTPS는 `nginx` 기본 설정내용에 없기 때문에 접속이 불가능할 것이다.

### 도메인 연결하기

> 도메인 주소를 입력할 때 서버 IP로 연결해주는 작업을 진행한다.

> 여러 도메인 주소를 하나의 서버 IP로 연결이 가능하며, 이 경우 아래에서와 같이 설정파일로 도메인 주소별로 다른 작업을 할 수 있도록 해준다.

- 각자 구매한 도메인 호스팅 사이트에 접속하여 도메인 관리 페이지로 이동

- DNS 정보 설정 페이지로 이동

- DNS 레코드 추가를 통해 서브도메인 등록

  - 유형은 `A` 레코드로 선택
  - 서브도메인 주소는 `[host 값].[도메인 주소]`로 정해지므로, 이를 고려하여 `host` 값 입력
    - `@` 를 입력하면 본 도메인을 의미함
  - IP 주소는 서버 public IP 입력
  - `TTL` 은 기본값으로 두기

- DNS 레코드 추가를 통해 도메인별명 등록
  - 유형은 `CNAME` 레코드로 선택
  - 도메인별명은 `[host 값].[도메인 주소]`로 정해지므로, 이를 고려하여 `host` 값 입력
    - `www.[서브도메인 host 값]` 등을 입력
  - 값 또는 위치에는 `[연결할 서브도메인 주소].` 입력
  - `TTL` 은 기본값으로 두기

> 이제 (서브)도메인 주소나 도메인별명을 입력하면, 입력한 서버 IP로 연결된다.

> HTTP(S)를 생략하고 주소만 입력하면, 기본적으로 HTTP(80번 포트)로 접근한다. HTTPS(443번 포트)로 접근하고 싶으면 `https://[주소]` 또는 `[주소]:443` 을 입력하면 된다.

### HTTP SSL 인증서 발급받기

> 서버 IP와 연결된 도메인을 대상으로만 발급이 가능하다.

> 각종 웹브라우저와 React는 HTTPS 통신을 기본으로 하기 때문에, SSL 인증서를 받지 않고 실제 배포 서버와 연결하면, 여러가지 오류가 생긴다...

- `letsencrypt` 설치
  - 설치시 `y` 선택, 오래 걸릴 수 있음

```bash
sudo apt-get install letsencrypt -y
```

- `nginx` 정지시키기
  - 이후 인증서 발급 방식에서 `80`번 포트가 열려있어야 하므로, `nginx`를 정지시켜 비워줘야 함

```bash
sudo nginx -s stop
```

- 인증서 발급하기
  - 중간에 `email` 입력 필요하며, 이후 `y` 선택
  - 오래걸릴 수 있음

```bash
sudo certbot certonly --standalone -d [도메인 이름]
```

> 이제 `/etc/letsencrypt/live/[도메인 이름]/` 안에 인증서 키가 위치하게 된다.

> 약 3개월 정도의 유효기간이 있어, 마지막 1 ~ 2주 전 쯤에 갱신이 필요하다.

### 프론트엔드 개발 서버 배포하기

> 위에서 연결한 HTTP 주소로 들어오는 요청에 따라 응답하는 프론트엔드 개발 서버를 배포해본다.

> EC2는 SSH 연결 사용자가 `root` 권한이 없기 때문에, 임시로 터미널에서 권한을 얻어서 진행하는 것으로 작성하였다...

- `root` 권한 얻기 및 파일 실행 권한 부여

```bash
sudo su
chmod 711 /home/ubuntu
```

- `/etc/nginx/sites-available/` 폴더 안에 `[서버 별칭].conf` 파일 생성

```bash
cd /etc/nginx/sites-available/
> [서버 별칭].conf
```

- `[서버 별칭].conf` 파일 안에 도메인 연결 설정내용 입력

```bash
# 1. 설정파일 열기
vi [서버 별칭].conf

# 2. 명령모드에서 입력모드로 전환
i

# 3. 아래 내용 ctrl + C 후 커맨드창에서 우클릭(붙여넣기)

# 4. 입력모드에서 esc 키 눌러 명령모드로 전환

# 5. 쓰기 후 나가기 처리
:wq
```

```text
server {
    listen 80;
    server_name [도메인 이름];
    return 301 https://[도메인 이름];
}

server {
    listen 443 ssl;
    server_name [도메인 이름];
    ssl_certificate /etc/letsencrypt/live/calculator.moohae.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/calculator.moohae.net/privkey.pem;

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
ln -s /etc/nginx/sites-available/[서버 별칭].conf /etc/nginx/sites-enabled/[서버 별칭].conf
```

- 기존 기본 설정 파일 비활성화

```bash
rm -f /etc/nginx/sites-enabled/default
```

- `nginx` 시작

```bash
service nginx start
```

- `root` 권한에서 나가기

```bash
exit
```

> 이제 HTTP(S) 주소로 접근하면 개발 서버가 응답한다.

> 또한 HTTPS로 접근 시 SSL 인증서가 유효하므로 브라우저 진입 시 주소창에 잠금(안전) 표시가 뜬다.

> 단, `yarn start`를 통해 개발 서버가 열려 있는 상황이어야 한다.

> 개발 서버는 포트 `3400`번으로 열려 있어야 한다. 만약 다른 서버가 `3400`번으로 열려 있었다면, 이 개발 서버는 `340X`번으로 열려서 연결이 불가능할 것이다.

### 프론트엔드 본 서버 배포하기

> 프론트엔드 빌드를 거쳐 본 서버를 배포한다.

> 위와 동일하게 임시로 터미널에서 권한을 얻어서 진행하는 것으로 작성하였다...

- 프론트엔드 빌드 버전 생성

```bash
cd ~/Developing/seoul_panorama_2123/
yarn build
```

- `root` 권한 얻기

```bash
sudo su
```

- `[서버 별칭].conf` 파일 안에 도메인 연결 설정내용 입력
  - 참고 : `/home/ubuntu/Developing/seoul_panorama_2123/build` 는 빌드 파일의 위치를 가리킴
  - 참고 : 위에서 사용한 도메인 외에 새로운 도메인이 필요

```bash
# 1. 설정파일 열기
vi [서버 별칭].conf

# 2. 명령모드에서 입력모드로 전환
i

# 3. 아래 내용 ctrl + C 후 커맨드창에서 우클릭(붙여넣기)

# 4. 입력모드에서 esc 키 눌러 명령모드로 전환

# 5. 쓰기 후 나가기 처리
:wq
```

```text
server {
    listen 80;
    server_name [도메인 이름];
    return 301 https://[도메인 이름];
}

server {
    listen 443 ssl;
    server_name [도메인 이름];
    ssl_certificate /etc/letsencrypt/live/calculator.moohae.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/calculator.moohae.net/privkey.pem;

    root /home/ubuntu/Developing/seoul_panorama_2123/build;
    index index.html index.htm index.nginx-debian.html;
    location / {
        try_files $uri	$uri/	/index.html;
    }
}
```

- `nginx` 시작

```bash
service nginx start
```

- `root` 권한에서 나가기

```bash
exit
```

> 이제 새 도메인에 접근하면 본 서버가 응답한다.

## EC2 재부팅 시 수행 필요 사항

### Remote-SSH 세팅 변경

> 재부팅 시 공개 IP 주소가 변경되므로, SSH 접속을 위해 주소 변경이 필요하다.

- `vscode Remote Explorer` 탭에서 `REMOTE > SSH` 위에 마우스 올리고, 설정 버튼 클릭해서 설정 파일 열기
- 설정사항 중 `HostName` 만 아래와 같이 변경

```
  HostName [새 public IPv4 주소(XX.XX.XX.XX 형식)]
```

> 이제 SSH 접속이 가능하다.

### `tmux` 세팅하기

> `tmux`는 내 vscode SSH 터미널 창으로부터 떼어 내 사용자 간 공유할 수 있는 터미널 창을 생성할 수 있다.

> 이 터미널 창은 vscode를 닫아도 독립적으로 유지되므로, 지속적인 서버 연결 등에 사용하면 좋은 것 같다.

> 단, 서버 재부팅 시 `tmux`로 생성한 창이 모두 날아가니, 다시 설정하고 공유할 필요가 있어 공통적으로 유지할 몇개 창을 정리해 보았다.

#### `tmux` 생성 및 사용 개괄

- `tmux` 가 작동하지 않는 경우 설치

```bash
sudo apt-get install tmux
```

- `tmux` 새 창 생성

```bash
tmux new -s [창 이름]
```

- `tmux` 기존 생성 창 접근

```bash
tmux attach -t [창 이름]
```

- `tmux` 창 외 추가 터미널 창 만들기

  - vscode terminal 필드 우상단에 `+` 버튼 클릭
  - 또는 바로 옆의 `v` 버튼 클릭 후 `bash` 선택
  - 바로 터미널이 뜨지 않는 경우 팝업 창에서 원하는 작업경로 선택

- `tmux` 창에서 나가기

  - 그냥 vscode terminal 필드 우측의 해당 탭에 마우스 올린 후 휴지통 버튼 클릭하면 됨
  - 또는 `ctrl + B` 입력 후 `D` 입력

- `tmux` 창 삭제하기

```bash
# 해당 tmux 안에서
exit
```

#### 재부팅 시 만들 `tmux` 창

> `tmux` 바깥에서는 사용자끼리 충돌할 수 있으니 아래 명령들을 지양하고 해당 `tmux` 창에서만 쓰자.

- `top` : 모니터링용 창

```bash
tmux new -s top
top
```

- `seoul` : 프론트 개발 창

```bash
tmux new -s seoul
cd ~/Developing/seoul_panorama_2123/
yarn start
```

- `seoulbuild` : 프론트 본 서버 업로드 창

```bash
tmux new -s seoulbuild
cd ~/Developing/seoul_panorama_2123/

# 빌드 필요한 경우 수시로 입력
yarn build
```

- `sudo` : `nginx`, `letsencrypt` 관련 사용자 상위 폴더를 조작하는 행위용 창

```bash
tmux new -s sudo
sudo su
```
