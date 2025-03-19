# alpine 18 버전 기반 빌더
FROM node:18-alpine AS builder

# 작업 디렉토리
WORKDIR /d2r-proj

# 코드 복사
COPY . .

# 의존성 설치 및 프로젝트 빌드
RUN npm install && npx quasar build -m ssr && npm cache clean --force

# ssr 의존성 설치
WORKDIR /d2r-proj/dist/ssr
RUN npm install && npm cache clean --force

# alpine 18 버전 기반
FROM node:18-alpine

# 작업 디렉토리
WORKDIR /d2r

COPY --from=builder /d2r-proj/dist/ssr /d2r

# 포트 명시
EXPOSE 6092

# node 실행
ENTRYPOINT ["node", "index.js"]