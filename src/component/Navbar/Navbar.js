import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import VideoIcon from "@material-ui/icons/VideoLibraryOutlined";
import MusicIcon from "@material-ui/icons/LibraryMusicOutlined";
import ImageIcon from "@material-ui/icons/CollectionsOutlined";
import DocIcon from "@material-ui/icons/FileCopyOutlined";
import ShareIcon from "@material-ui/icons/Share";
import BackIcon from "@material-ui/icons/ArrowBack";
import SdStorage from "@material-ui/icons/SdStorage";
import OpenIcon from "@material-ui/icons/OpenInNew";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import OpenFolderIcon from "@material-ui/icons/FolderOpen";
import RenameIcon from "@material-ui/icons/BorderColor";
import MoveIcon from "@material-ui/icons/Input";
import DeleteIcon from "@material-ui/icons/Delete";
import UploadIcon from "@material-ui/icons/CloudUpload";
import FolderShared from "@material-ui/icons/FolderShared";
import SaveIcon from "@material-ui/icons/Save";
import MenuIcon from "@material-ui/icons/Menu";
import { isPreviewable } from "../../config";
import {
    drawerToggleAction,
    setSelectedTarget,
    navitateTo,
    openCreateFolderDialog,
    changeContextMenu,
    searchMyFile,
    saveFile,
    openMusicDialog,
    showImgPreivew,
    toggleSnackbar,
    openMoveDialog,
    openRemoveDialog,
    openShareDialog,
    openRenameDialog,
    openLoadingDialog
} from "../../actions";
import {
    allowSharePreview,
    checkGetParameters,
    changeThemeColor
} from "../../untils";
import Uploader from "../Upload/Uploader.js";
import { sizeToString } from "../../untils";
import pathHelper from "../../untils/page";
import SezrchBar from "./SearchBar";
import StorageBar from "./StorageBar";
import UserAvatar from "./UserAvatar";
import UserInfo from "./UserInfo";
import { AccountArrowRight, AccountPlus } from "mdi-material-ui";
import { withRouter } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    withStyles,
    withTheme,
    Drawer,
    SwipeableDrawer,
    IconButton,
    Hidden,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    List,
    Grow,
    Tooltip, Card
} from "@material-ui/core";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Auth from "../../middleware/Auth";
import {ExpandMore, KeyboardArrowRight} from "@material-ui/icons";

const ExpansionPanel = withStyles({
    root: {
        maxWidth: "100%",
        boxShadow: "none",
        "&:not(:last-child)": {
            borderBottom: 0
        },
        "&:before": {
            display: "none"
        },
        "&$expanded": {margin:0,}
    },
    expanded: {
    }
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        minHeight: 0,
        padding: 0,

        "&$expanded": {
            minHeight: 0
        }
    },
    content: {
        maxWidth: "100%",
        margin: 0,
        display: "block",
        "&$expanded": {
            margin: "0"
        }
    },
    expanded: {}
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
    root: {
        display: "block",
        padding: theme.spacing(0)
    }
}))(MuiExpansionPanelDetails);

const drawerWidth = 240;
const drawerWidthMobile = 270;

const mapStateToProps = state => {
    return {
        desktopOpen: state.viewUpdate.open,
        selected: state.explorer.selected,
        isMultiple: state.explorer.selectProps.isMultiple,
        withFolder: state.explorer.selectProps.withFolder,
        withFile: state.explorer.selectProps.withFile,
        path: state.navigator.path,
        keywords: state.explorer.keywords,
        title: state.siteConfig.title,
        subTitle: state.viewUpdate.subTitle,
        loadUploader: state.viewUpdate.loadUploader,
        isLogin: state.viewUpdate.isLogin
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleDesktopToggle: open => {
            dispatch(drawerToggleAction(open));
        },
        setSelectedTarget: targets => {
            dispatch(setSelectedTarget(targets));
        },
        navitateTo: path => {
            dispatch(navitateTo(path));
        },
        openCreateFolderDialog: () => {
            dispatch(openCreateFolderDialog());
        },
        changeContextMenu: (type, open) => {
            dispatch(changeContextMenu(type, open));
        },
        searchMyFile: keywords => {
            dispatch(searchMyFile(keywords));
        },
        saveFile: () => {
            dispatch(saveFile());
        },
        openMusicDialog: () => {
            dispatch(openMusicDialog());
        },
        showImgPreivew: first => {
            dispatch(showImgPreivew(first));
        },
        toggleSnackbar: (vertical, horizontal, msg, color) => {
            dispatch(toggleSnackbar(vertical, horizontal, msg, color));
        },
        openRenameDialog: () => {
            dispatch(openRenameDialog());
        },
        openMoveDialog: () => {
            dispatch(openMoveDialog());
        },
        openRemoveDialog: () => {
            dispatch(openRemoveDialog());
        },
        openShareDialog: () => {
            dispatch(openShareDialog());
        },
        openLoadingDialog: text => {
            dispatch(openLoadingDialog(text));
        }
    };
};

const styles = theme => ({
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.down("xs")]: {
            marginLeft: drawerWidthMobile
        },
        zIndex: theme.zIndex.drawer + 1,
        transition: " background-color 250ms"
    },

    drawer: {
        width: 0,
        flexShrink: 0
    },
    drawerDesktop: {
        width: drawerWidth,
        flexShrink: 0
    },
    icon: {
        marginRight: theme.spacing(2)
    },
    menuButton: {
        marginRight: 20,
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    },
    menuButtonDesktop: {
        marginRight: 20,
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    },
    menuIcon: {
        marginRight: 20
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidthMobile
    },
    upDrawer: {
        marginBottom: 90
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: "hidden",
        width: 0
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    hiddenButton: {
        display: "none"
    },
    grow: {
        flexGrow: 1
    },
    badge: {
        top: 1,
        right: -15
    },
    nested: {
        paddingLeft: theme.spacing(4)
    },
    sectionForFile: {
        display: "flex"
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    },
    addButton: {
        marginLeft: "40px",
        marginTop: "25px",
        marginBottom: "15px"
    },
    fabButton: {
        borderRadius: "100px"
    },
    badgeFix: {
        right: "10px"
    },
    iconFix: {
        marginLeft: "16px"
    },
    dividerFix: {
        marginTop: "8px"
    },
    folderShareIcon: {
        verticalAlign: "sub",
        marginRight: "5px"
    },
    shareInfoContainer: {
        display: "flex",
        marginTop: "15px",
        marginBottom: "20px",
        marginLeft: "28px",
        textDecoration: "none"
    },
    shareAvatar: {
        width: "40px",
        height: "40px"
    },
    stickFooter: {
        bottom: "0px",
        position: "absolute",
        backgroundColor: theme.palette.background.paper,
        width: "100%"
    },
    ownerInfo: {
        marginLeft: "10px",
        width: "150px"
    },
    subMenu:{
        marginLeft:theme.spacing(2),
    },
    expand: {
        display:"none",
        transition: ".15s all ease-in-out"
    },
    expanded: {
        display:"block",
        transform: "rotate(90deg)"
    },
});
class NavbarCompoment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false,
            tagOpen:true,
        };
        this.UploaderRef = React.createRef();
    }

    componentDidMount = () => {
        changeThemeColor(
            this.props.selected.length <= 1 &&
                !(!this.props.isMultiple && this.props.withFile)
                ? this.props.theme.palette.primary.main
                : this.props.theme.palette.background.default
        );
    };

    componentWillReceiveProps = nextProps => {
        if (
            (this.props.selected.length <= 1 &&
                !(!this.props.isMultiple && this.props.withFile)) !==
            (nextProps.selected.length <= 1 &&
                !(!nextProps.isMultiple && nextProps.withFile))
        ) {
            changeThemeColor(
                !(
                    this.props.selected.length <= 1 &&
                    !(!this.props.isMultiple && this.props.withFile)
                )
                    ? this.props.theme.palette.primary.main
                    : this.props.theme.palette.background.default
            );
        }
    };

    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };

    loadUploader = () => {
        if (pathHelper.isHomePage(this.props.location.pathname)) {
            return <>{this.props.loadUploader && <Uploader />}</>;
        }
    };

    filterFile = type => {
        this.props.searchMyFile("{filterType:" + type + "}");
    };

    openPreview = () => {
        let isShare = pathHelper.isSharePage(this.props.location.pathname);
        if (isShare) {
            let user = Auth.GetUser();
            if (!Auth.Check() && user && !user.group.shareDownload) {
                this.props.toggleSnackbar(
                    "top",
                    "right",
                    "请先登录",
                    "warning"
                );
                this.props.changeContextMenu("file", false);
                return;
            }
        }
        this.props.changeContextMenu("file", false);
        let previewPath =
            this.props.selected[0].path === "/"
                ? this.props.selected[0].path + this.props.selected[0].name
                : this.props.selected[0].path +
                  "/" +
                  this.props.selected[0].name;
        switch (isPreviewable(this.props.selected[0].name)) {
            case "img":
                this.props.showImgPreivew(this.props.selected[0]);
                return;
            case "msDoc":
                if (isShare) {
                    this.props.history.push(
                        this.props.selected[0].key +
                            "/doc?name=" +
                            encodeURIComponent(this.props.selected[0].name) +
                            "&share_path=" +
                            encodeURIComponent(previewPath)
                    );
                    return;
                }
                this.props.history.push(
                    "/doc" + previewPath + "?id=" + this.props.selected[0].id
                );
                return;
            case "audio":
                this.props.openMusicDialog();
                return;
            case "video":
                if (isShare) {
                    this.props.history.push(
                        this.props.selected[0].key +
                            "/video?name=" +
                            encodeURIComponent(this.props.selected[0].name) +
                            "&share_path=" +
                            encodeURIComponent(previewPath)
                    );
                    return;
                }
                this.props.history.push(
                    "/video" + previewPath + "?id=" + this.props.selected[0].id
                );
                return;
            case "edit":
                if (isShare) {
                    this.props.history.push(
                        this.props.selected[0].key +
                            "/text?name=" +
                            encodeURIComponent(this.props.selected[0].name) +
                            "&share_path=" +
                            encodeURIComponent(previewPath)
                    );
                    return;
                }
                this.props.history.push(
                    "/text" +previewPath + "?id=" + this.props.selected[0].id
                );
                return;
            default:
                return;
        }
    };

    openDownload = () => {
        if (!allowSharePreview()) {
            this.props.toggleSnackbar(
                "top",
                "right",
                "未登录用户无法预览",
                "warning"
            );
            return;
        }
        this.props.openLoadingDialog("获取下载地址...");
    };

    archiveDownload = () => {
        this.props.openLoadingDialog("打包中...");
    };

    render() {
        const { classes } = this.props;
        const user = Auth.GetUser(this.props.isLogin);
        const isHomePage = pathHelper.isHomePage(this.props.location.pathname);
        const isSharePage = pathHelper.isSharePage(
            this.props.location.pathname
        );

        const drawer = (
            <div id="container" className={classes.upDrawer}>
                {pathHelper.isMobile() && <UserInfo />}

                {Auth.Check(this.props.isLogin) && (
                    <ExpansionPanel
                        square
                        expanded={this.state.tagOpen && isHomePage}
                        onChange={()=>isHomePage&&this.setState({tagOpen:!this.state.tagOpen})}
                    >
                        <ExpansionPanelSummary
                            aria-controls="panel1d-content"
                            id="panel1d-header"
                        >
                            <ListItem
                                button
                                key="我的文件"
                                onClick={() =>
                                    !isHomePage&&this.props.history.push("/home?path=%2F")
                                }
                            >
                                <ListItemIcon>
                                        <KeyboardArrowRight
                                            className={classNames(
                                                {
                                                    [classes.expanded]:
                                                    this.state.tagOpen && isHomePage,
                                                    [classes.iconFix]:true,
                                                },
                                                classes.expand
                                            )}
                                        />
                                    {!(this.state.tagOpen && isHomePage)&&<FolderShared className={classes.iconFix} />}


                                </ListItemIcon>
                                <ListItemText primary="我的文件" />
                            </ListItem>
                            <Divider />
                        </ExpansionPanelSummary>


                        <ExpansionPanelDetails>
                                <List>
                                    <ListItem
                                        button
                                        id="pickfiles"
                                        className={classes.hiddenButton}
                                    >
                                        <ListItemIcon>
                                            <UploadIcon />
                                        </ListItemIcon>
                                        <ListItemText />
                                    </ListItem>
                                    {[
                                        {
                                            key: "视频",
                                            id: "video",
                                            icon: (
                                                <VideoIcon
                                                    className={[
                                                        classes.iconFix,
                                                        classes.iconVideo
                                                    ]}
                                                />
                                            )
                                        },
                                        {
                                            key: "图片",
                                            id: "image",
                                            icon: (
                                                <ImageIcon
                                                    className={[
                                                        classes.iconFix,
                                                        classes.iconImg
                                                    ]}
                                                />
                                            )
                                        },
                                        {
                                            key: "音频",
                                            id: "audio",
                                            icon: (
                                                <MusicIcon
                                                    className={[
                                                        classes.iconFix,
                                                        classes.iconAudio
                                                    ]}
                                                />
                                            )
                                        },
                                        {
                                            key: "文档",
                                            id: "doc",
                                            icon: (
                                                <DocIcon
                                                    className={[
                                                        classes.iconFix,
                                                        classes.iconDoc
                                                    ]}
                                                />
                                            )
                                        }
                                    ].map(v => (
                                        <ListItem
                                            button
                                            key={v.key}
                                            onClick={() =>
                                                this.filterFile(v.id)
                                            }
                                        >
                                            <ListItemIcon className={classes.subMenu}>
                                                {v.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={v.key} />
                                        </ListItem>
                                    ))}{" "}
                                </List>{" "}
                                <Divider />
                            </ExpansionPanelDetails>

                    </ExpansionPanel>
                )}

                {Auth.Check(this.props.isLogin) && (
                    <List>
                        <ListItem
                            button
                            key="我的分享"
                            onClick={() => (window.location.href = "/Share/My")}
                        >
                            <ListItemIcon>
                                <ShareIcon className={classes.iconFix} />
                            </ListItemIcon>
                            <ListItemText primary="我的分享" />
                        </ListItem>
                        <ListItem
                            button
                            key="离线下载"
                            onClick={() => this.props.history.push("/aria2?")}
                        >
                            <ListItemIcon>
                                <DownloadIcon className={classes.iconFix} />
                            </ListItemIcon>
                            <ListItemText primary="离线下载" />
                        </ListItem>
                        <ListItem
                            button
                            key="容量配额"
                            onClick={() =>
                                (window.location.href = "/Home/Quota")
                            }
                        >
                            <ListItemIcon>
                                <SdStorage className={classes.iconFix} />
                            </ListItemIcon>
                            <ListItemText primary="容量配额" />
                        </ListItem>
                        {!pathHelper.isSharePage(
                            this.props.location.pathname
                        ) && (
                            <div>
                                <StorageBar></StorageBar>
                            </div>
                        )}
                    </List>
                )}
                {!Auth.Check(this.props.isLogin) && (
                    <div>
                        <ListItem
                            button
                            key="登录"
                            onClick={() => (window.location.href = "/Login")}
                        >
                            <ListItemIcon>
                                <AccountArrowRight
                                    className={classes.iconFix}
                                />
                            </ListItemIcon>
                            <ListItemText primary="登录" />
                        </ListItem>
                        <ListItem
                            button
                            key="注册"
                            onClick={() => (window.location.href = "/Signup")}
                        >
                            <ListItemIcon>
                                <AccountPlus className={classes.iconFix} />
                            </ListItemIcon>
                            <ListItemText primary="注册" />
                        </ListItem>
                    </div>
                )}
                {/*{pathHelper.isSharePage(this.props.location.pathname) && (*/}
                {/*    <div className={classes.stickFooter}>*/}
                {/*        <Divider />*/}
                {/*        <a*/}
                {/*            className={classes.shareInfoContainer}*/}
                {/*            href={"/Profile/" + window.shareInfo.ownerUid}*/}
                {/*        >*/}
                {/*            <Avatar*/}
                {/*                src={*/}
                {/*                    "/Member/Avatar/" +*/}
                {/*                    window.shareInfo.ownerUid +*/}
                {/*                    "/l"*/}
                {/*                }*/}
                {/*                className={classes.shareAvatar}*/}
                {/*            />*/}
                {/*            <div className={classes.ownerInfo}>*/}
                {/*                <Typography noWrap>*/}
                {/*                    {window.shareInfo.ownerNick}*/}
                {/*                </Typography>*/}
                {/*                <Typography*/}
                {/*                    noWrap*/}
                {/*                    variant="caption"*/}
                {/*                    color="textSecondary"*/}
                {/*                >*/}
                {/*                    分享于{window.shareInfo.shareDate}*/}
                {/*                </Typography>*/}
                {/*            </div>*/}
                {/*        </a>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
        );
        const iOS =
            process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
        return (
            <div>
                <AppBar
                    position="fixed"
                    className={classes.appBar}
                    color={
                        this.props.theme.palette.type !== "dark" &&
                        this.props.selected.length <= 1 &&
                        !(!this.props.isMultiple && this.props.withFile)
                            ? "primary"
                            : "default"
                    }
                >
                    <Toolbar>
                        {this.props.selected.length <= 1 &&
                            !(
                                !this.props.isMultiple && this.props.withFile
                            ) && (
                                <IconButton
                                    color="inherit"
                                    aria-label="Open drawer"
                                    onClick={this.handleDrawerToggle}
                                    className={classes.menuButton}
                                >
                                    <MenuIcon />
                                </IconButton>
                            )}
                        {this.props.selected.length <= 1 &&
                            !(
                                !this.props.isMultiple && this.props.withFile
                            ) && (
                                <IconButton
                                    color="inherit"
                                    aria-label="Open drawer"
                                    onClick={() =>
                                        this.props.handleDesktopToggle(
                                            !this.props.desktopOpen
                                        )
                                    }
                                    className={classes.menuButtonDesktop}
                                >
                                    <MenuIcon />
                                </IconButton>
                            )}
                        {(this.props.selected.length > 1 ||
                            (!this.props.isMultiple && this.props.withFile)) &&
                            (isHomePage ||
                                pathHelper.isSharePage(
                                    this.props.location.pathname
                                )) && (
                                <Grow
                                    in={
                                        this.props.selected.length > 1 ||
                                        (!this.props.isMultiple &&
                                            this.props.withFile)
                                    }
                                >
                                    <IconButton
                                        color="inherit"
                                        className={classes.menuIcon}
                                        onClick={() =>
                                            this.props.setSelectedTarget([])
                                        }
                                    >
                                        <BackIcon />
                                    </IconButton>
                                </Grow>
                            )}
                        {this.props.selected.length <= 1 &&
                            !(
                                !this.props.isMultiple && this.props.withFile
                            ) && (
                                <Typography variant="h6" color="inherit" noWrap>
                                    {pathHelper.isSharePage(
                                        this.props.location.pathname
                                    ) &&
                                        window.pageId === "" && (
                                            <FolderShared
                                                className={
                                                    classes.folderShareIcon
                                                }
                                            />
                                        )}
                                    {this.props.subTitle
                                        ? this.props.subTitle
                                        : this.props.title}
                                </Typography>
                            )}

                        {!this.props.isMultiple &&
                            this.props.withFile &&
                            !pathHelper.isMobile() && (
                                <Typography variant="h6" color="inherit" noWrap>
                                    {this.props.selected[0].name}{" "}
                                    {(isHomePage ||
                                        pathHelper.isSharePage(
                                            this.props.location.pathname
                                        )) &&
                                        "(" +
                                            sizeToString(
                                                this.props.selected[0].size
                                            ) +
                                            ")"}
                                </Typography>
                            )}

                        {this.props.selected.length > 1 &&
                            !pathHelper.isMobile() && (
                                <Typography variant="h6" color="inherit" noWrap>
                                    {this.props.selected.length}个对象
                                </Typography>
                            )}
                        {this.props.selected.length <= 1 &&
                            !(
                                !this.props.isMultiple && this.props.withFile
                            ) && <SezrchBar />}
                        <div className={classes.grow} />
                        {(this.props.selected.length > 1 ||
                            (!this.props.isMultiple && this.props.withFile)) &&
                            !isHomePage &&
                            !pathHelper.isSharePage(
                                this.props.location.pathname
                            ) &&
                            Auth.Check(this.props.isLogin) &&
                            !checkGetParameters("share") && (
                                <div className={classes.sectionForFile}>
                                    <Tooltip title="保存">
                                        <IconButton
                                            color="inherit"
                                            onClick={() =>
                                                this.props.saveFile()
                                            }
                                        >
                                            <SaveIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            )}
                        {(this.props.selected.length > 1 ||
                            (!this.props.isMultiple && this.props.withFile)) &&
                            (isHomePage || isSharePage) && (
                                <div className={classes.sectionForFile}>
                                    {!this.props.isMultiple &&
                                        this.props.withFile &&
                                        (!isSharePage ||
                                            (window.shareInfo &&
                                                window.shareInfo.preview)) &&
                                        isPreviewable(
                                            this.props.selected[0].name
                                        ) && (
                                            <Grow
                                                in={
                                                    !this.props.isMultiple &&
                                                    this.props.withFile &&
                                                    isPreviewable(
                                                        this.props.selected[0]
                                                            .name
                                                    )
                                                }
                                            >
                                                <Tooltip title="打开">
                                                    <IconButton
                                                        color="inherit"
                                                        onClick={() =>
                                                            this.openPreview()
                                                        }
                                                    >
                                                        <OpenIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grow>
                                        )}
                                    {!this.props.isMultiple &&
                                        this.props.withFile && (
                                            <Grow
                                                in={
                                                    !this.props.isMultiple &&
                                                    this.props.withFile
                                                }
                                            >
                                                <Tooltip title="下载">
                                                    <IconButton
                                                        color="inherit"
                                                        onClick={() =>
                                                            this.openDownload()
                                                        }
                                                    >
                                                        <DownloadIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grow>
                                        )}
                                    {(this.props.isMultiple ||
                                        this.props.withFolder) &&
                                        user.group.allowArchiveDownload && (
                                            <Grow
                                                in={
                                                    (this.props.isMultiple ||
                                                        this.props
                                                            .withFolder) &&
                                                    user.group
                                                        .allowArchiveDownload
                                                }
                                            >
                                                <Tooltip title="打包下载">
                                                    <IconButton
                                                        color="inherit"
                                                        onClick={() =>
                                                            this.archiveDownload()
                                                        }
                                                    >
                                                        <DownloadIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grow>
                                        )}

                                    {!this.props.isMultiple &&
                                        this.props.withFolder && (
                                            <Grow
                                                in={
                                                    !this.props.isMultiple &&
                                                    this.props.withFolder
                                                }
                                            >
                                                <Tooltip title="进入目录">
                                                    <IconButton
                                                        color="inherit"
                                                        onClick={() =>
                                                            this.props.navitateTo(
                                                                this.props
                                                                    .path ===
                                                                    "/"
                                                                    ? this.props
                                                                          .path +
                                                                          this
                                                                              .props
                                                                              .selected[0]
                                                                              .name
                                                                    : this.props
                                                                          .path +
                                                                          "/" +
                                                                          this
                                                                              .props
                                                                              .selected[0]
                                                                              .name
                                                            )
                                                        }
                                                    >
                                                        <OpenFolderIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grow>
                                        )}
                                    {!this.props.isMultiple && !isSharePage && (
                                        <Grow in={!this.props.isMultiple}>
                                            <Tooltip title="分享">
                                                <IconButton
                                                    color="inherit"
                                                    onClick={() =>
                                                        this.props.openShareDialog()
                                                    }
                                                >
                                                    <ShareIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grow>
                                    )}
                                    {!this.props.isMultiple && !isSharePage && (
                                        <Grow in={!this.props.isMultiple}>
                                            <Tooltip title="重命名">
                                                <IconButton
                                                    color="inherit"
                                                    onClick={() =>
                                                        this.props.openRenameDialog()
                                                    }
                                                >
                                                    <RenameIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grow>
                                    )}
                                    {!isSharePage && (
                                        <div style={{ display: "flex" }}>
                                            {!pathHelper.isMobile() && (
                                                <Grow
                                                    in={
                                                        this.props.selected
                                                            .length !== 0 &&
                                                        !pathHelper.isMobile()
                                                    }
                                                >
                                                    <Tooltip title="移动">
                                                        <IconButton
                                                            color="inherit"
                                                            onClick={() =>
                                                                this.props.openMoveDialog()
                                                            }
                                                        >
                                                            <MoveIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grow>
                                            )}

                                            <Grow
                                                in={
                                                    this.props.selected
                                                        .length !== 0
                                                }
                                            >
                                                <Tooltip title="删除">
                                                    <IconButton
                                                        color="inherit"
                                                        onClick={() =>
                                                            this.props.openRemoveDialog()
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grow>
                                        </div>
                                    )}
                                </div>
                            )}
                        {this.props.selected.length <= 1 &&
                            !(
                                !this.props.isMultiple && this.props.withFile
                            ) && <UserAvatar />}
                    </Toolbar>
                </AppBar>
                {this.loadUploader()}

                <Hidden smUp implementation="css">
                    <SwipeableDrawer
                        container={this.props.container}
                        variant="temporary"
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        anchor="left"
                        open={this.state.mobileOpen}
                        onClose={this.handleDrawerToggle}
                        onOpen={() =>
                            this.setState(state => ({ mobileOpen: true }))
                        }
                        disableDiscovery={iOS}
                        ModalProps={{
                            keepMounted: true // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </SwipeableDrawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classNames({
                                [classes.drawerOpen]: this.props.desktopOpen,
                                [classes.drawerClose]: !this.props.desktopOpen
                            })
                        }}
                        className={classNames(classes.drawer, {
                            [classes.drawerOpen]: this.props.desktopOpen,
                            [classes.drawerClose]: !this.props.desktopOpen
                        })}
                        variant="persistent"
                        anchor="left"
                        open={this.props.desktopOpen}
                    >
                        <div className={classes.toolbar} />
                        {drawer}
                    </Drawer>
                </Hidden>
            </div>
        );
    }
}
NavbarCompoment.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

const Navbar = connect(
    mapStateToProps,
    mapDispatchToProps
)(withTheme(withStyles(styles)(withRouter(NavbarCompoment))));

export default Navbar;
