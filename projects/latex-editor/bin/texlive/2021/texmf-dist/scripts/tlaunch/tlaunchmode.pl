#!/usr/bin/env perl

# This file is public domain.

my $Master;

BEGIN {
  $^W = 1;
  $Master = `%COMSPEC% /c kpsewhich -var-value=SELFAUTOPARENT`;
  chomp($Master);
  unshift (@INC, "$Master/tlpkg");
}

use TeXLive::TLWinGoo;
use TeXLive::TLPDB;
use TeXLive::TLPOBJ;
use TeXLive::TLConfig;
use TeXLive::TLUtils;

sub help {
  print <<ENDHELP;

  tlaunchmode on
  tlaunchmode off

tlaunchmode switches a TeX Live installation between tlaunch mode
and classic mode.

tlaunchmode means:
- a launcher with menus and buttons instead of a submenu
- per-user configuration at first startup.
  This configuration can be undone from within the launcher
  and from the `Programs and Featurers' Control Panel item.

See the manual for additional details and customization options.
ENDHELP
  exit;
}
my $do_lmode = shift;
if (defined $do_lmode) {
  if (lc($do_lmode) eq "on") { $do_lmode = 1; }
  elsif (lc($do_lmode) eq "off") { $do_lmode = 0; }
  else {help; }
} else {
  help;
}

die "Launchermode requires Vista or later\n"
  unless TeXLive::TLWinGoo::is_vista();



my $localtlpdb = TeXLive::TLPDB->new ("root" => $Master);

die "Need admin permissions; please rerun from elevated command prompt\n"
  unless ((!$localtlpdb->option("w32_multi_user") or
             TeXLive::TLWinGoo::admin()));
TeXLive::TLWinGoo::non_admin() if (TeXLive::TLWinGoo::admin() &&
  !$localtlpdb->option("w32_multi_user"));

if (!defined($localtlpdb)) {
  die("Cannot load the TLPDB from $Master\n"); }

my $Masterbsl;
($Masterbsl = $Master) =~ s!/!\\!g;

if ($do_lmode) {
  for my $pkg ($localtlpdb->list_packages) {
      # uninstall script: `&' before TeXLive
      TeXLive::TLUtils::do_postaction("remove", $localtlpdb->get_package($pkg),
        $localtlpdb->option("file_assocs"),
        $localtlpdb->option("desktop_integration"),
        $localtlpdb->option("desktop_integration"),
        0);
  }
  my $menupath = &TeXLive::TLWinGoo::menu_path();
  $menupath =~ s!/!\\!g;
  `rmdir /s /q "$menupath\\$TeXLive::TLConfig::WindowsMainMenuName" 2>nul`;

  # remove bindir from PATH settings
  TeXLive::TLUtils::w32_remove_from_path("$Master/bin/win32", 
    $localtlpdb->option("w32_multi_user"));

  # unregister uninstaller
  TeXLive::TLWinGoo::unregister_uninstaller(
    $localtlpdb->option("w32_multi_user"));

  # for multi-user, adjust root texmf.cnf for xetex
  if ($localtlpdb->option("w32_multi_user")) {
    if (!(-f "$Master/texmf.cnf.orig")) {
      `copy /b $Masterbsl\\texmf.cnf $Masterbsl\\texmf.cnf.orig`;
    }
    if (open (TMF, ">> $Master/texmf.cnf")) {
      print TMF "\nFC_CACHEDIR=\$TEXMFVAR/fonts/cache\n";
      close(TMF);
    }
  }
  if ($localtlpdb->option("w32_multi_user")) {
    `"$Master/bin/win32/tlaunch.exe" admin_inst`;
  } else {
    `"$Master/bin/win32/tlaunch.exe" user_inst`;
  }
} else {
  `"$Master/bin/win32/tlaunch.exe" uninst`;

  TeXLive::TLWinGoo::create_uninstaller($Master);
  TeXLive::TLUtils::w32_add_to_path("$Master/bin/win32",
    $localtlpdb->option("w32_multi_user"));

  for my $pkg ($localtlpdb->list_packages) {
      # uninstall script: `&' before TeXLive
      TeXLive::TLUtils::do_postaction("install", $localtlpdb->get_package($pkg),
        $localtlpdb->option("file_assocs"),
        $localtlpdb->option("desktop_integration"),
        $localtlpdb->option("desktop_integration"),
        0);
    }

  TeXLive::TLWinGoo::broadcast_env();
  TeXLive::TLWinGoo::update_assocs();

  # restore original root texmf.cnf
  if (-f "$Master/texmf.cnf.orig") {
    chdir $Master;
    unlink "texmf.cnf";
    sleep 2;
    rename "texmf.cnf.orig", "texmf.cnf";
  }
  if ((-f "$Master/texmf.cnf.orig") || !(-f "$Master/texmf.cnf")) {
    print "Failed to restore root $Master/texmf.cnf; do this manually.";
  }
}
