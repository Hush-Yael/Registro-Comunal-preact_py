# -*- mode: python ; coding: utf-8 -*-

a = Analysis(
    ["app-tk.py"],
    pathex=[],
    binaries=[],
    datas=[("..\\frontend\\dist", "estatico"), ("plantillas", "plantillas")],
    hiddenimports=[
        "reportlab.graphics.barcode.common",
        "reportlab.graphics.barcode.code128",
        "reportlab.graphics.barcode.code93",
        "reportlab.graphics.barcode.code39",
        "reportlab.graphics.barcode.code93",
        "reportlab.graphics.barcode.usps",
        "reportlab.graphics.barcode.usps4s",
        "reportlab.graphics.barcode.ecc200datamatrix",
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name="registro-comunal.tk-x86",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
