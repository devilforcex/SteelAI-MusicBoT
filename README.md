# SteelAI-MusicBoT

Първа версия на музикалния бот, създаден автоматично с OpenClaw агента **SteelAI** (с малки корекции) — и благодарности към приятеля **Steel**.

## CI статус
[![ci](https://github.com/devilforcex/SteelAI-MusicBoT/actions/workflows/ci.yml/badge.svg)](https://github.com/devilforcex/SteelAI-MusicBoT/actions/workflows/ci.yml)

## Характеристики
- Discord.js музикален бот с Lavalink
- Slash команди (play/skip/queue/stop/volume и др.)
- Auto-join радио поток (пример: Techno.FM)
- Бутон/interaction поддръжка
- Docker Compose с Lavalink и Postgres

## Как да стартираш (Docker)
```bash
git clone https://github.com/devilforcex/SteelAI-MusicBoT.git
cd SteelAI-MusicBoT
cp .env.example .env  # попълни токени/ID
# редактирай .env: DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID, AUTOJOIN_VC_ID, RADIO_STREAM_URL
npm install
npm run build
npm run deploy:commands   # регистрира slash командите
# или с Docker
DISCORD_TOKEN=... DISCORD_CLIENT_ID=... DISCORD_GUILD_ID=... AUTOJOIN_VC_ID=... \
RADIO_STREAM_URL=... docker compose up -d --build
```

## Env променливи (.env)
- `DISCORD_TOKEN=your_discord_bot_token_here`
- `DISCORD_CLIENT_ID=your_discord_client_id`
- `DISCORD_GUILD_ID=your_guild_id`
- `DATABASE_URL=postgresql://bot:botpassword@db:5432/botdb`
- `LAVALINK_HOST=lavalink`
- `LAVALINK_PORT=2333`
- `LAVALINK_PASSWORD=youshallnotpass`
- `AUTOJOIN_VC_ID=voice_channel_id_for_autojoin`
- `RADIO_STREAM_URL=http://stream.techno.fm/radio1-192k.mp3`
- `NODE_ENV=production`

## Lavalink
`lavalink/application.yml` е конфигуриран с YouTube/SoundCloud/Twitch/Vimeo/http източници и парола `youshallnotpass` (примерна — промени я в .env + application.yml при нужда).

## Забележки за сигурност
- Не комитвай реални токени/ID. .env е в .gitignore.
- Смени паролата за Lavalink при продукция.

## Авторство
- Автоматизирано от OpenClaw агент **SteelAI**.
- Благодарности към **Steel** за идеята и приятелската подкрепа.

## Лиценз
MIT (по желание може да се смени).