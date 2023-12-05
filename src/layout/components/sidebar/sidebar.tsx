import { Link } from "react-router-dom";
import {
	Sidebar as ReactSidebar,
	Menu,
	MenuItem,
	SubMenu,
} from "react-pro-sidebar";

import styles from "./sidebar.module.scss";

export function Sidebar() {
	return (
		<ReactSidebar className={styles.sidebar} width="200px" collapsedWidth="100px" backgroundColor="white">
			<Menu>
				<SubMenu label="Charts">
					<MenuItem> Pie charts </MenuItem>
					<MenuItem> Line charts </MenuItem>
				</SubMenu>
				<MenuItem> Documentation </MenuItem>
				<MenuItem> Calendar </MenuItem>
			</Menu>
		</ReactSidebar>
	);
}

export default Sidebar;
