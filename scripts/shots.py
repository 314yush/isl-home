import sys
from playwright.sync_api import sync_playwright
B="http://localhost:3100"
pages={"home":"/","match":"/match/401925440","table":"/table","club":"/club/bengaluru-fc"}
with sync_playwright() as p:
    br=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for vw,tag in [(1440,"desktop"),(390,"mobile")]:
        ctx=br.new_context(viewport={"width":vw,"height":900},device_scale_factor=1 if vw>500 else 2)
        pg=ctx.new_page()
        for k,u in pages.items():
            pg.goto(B+u,wait_until="networkidle"); pg.add_style_tag(content="body{position:relative} nav.fixed{position:absolute!important}"); pg.wait_for_timeout(400)
            pg.screenshot(path=f"screenshots/{k}-{tag}.png",full_page=True)
    br.close()
