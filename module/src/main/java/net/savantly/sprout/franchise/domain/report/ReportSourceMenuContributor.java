package net.savantly.sprout.franchise.domain.report;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import net.savantly.sprout.domain.menu.MenuContributor;
import net.savantly.sprout.domain.menu.MenuDto;
import net.savantly.sprout.franchise.FranchiseManagerModule;

public class ReportSourceMenuContributor implements MenuContributor {

	private final ReportSourceRepository repository;

	public ReportSourceMenuContributor(ReportSourceRepository repository) {
		this.repository = repository;
	}

	@Override
	public void contribute(List<MenuDto> dtos) {
		MenuDto rootMenu = new MenuDto().setIcon("chart-line").setDisplayText("Reports").setName("fm-reports");

		repository.findByOrderByWeightAsc().forEach((r) -> {
			if (Objects.nonNull(r.getMenuPath())) {
				final List<String> segments = new ArrayList<>();
				final String[] pathParts = r.getMenuPath().split("\\|");
				for (int i = 0; i < pathParts.length; i++) {
					if (Objects.nonNull(pathParts[i]) && !pathParts[i].isEmpty());
					segments.add(pathParts[i]);
				}
				insertMenuAtPath(segments, rootMenu, r);
			} else {
				insertMenuAtPath(Arrays.asList(), rootMenu, r);
			}
		});

		//dtos.add(rootMenu);
	}

	private void insertMenuAtPath(List<String> segments, MenuDto currentMenuItem, ReportSource r) {
		if (segments.size() > 0 && Objects.nonNull(segments.get(0)) && !segments.get(0).isEmpty()) {
			final String first = cleanSegment(segments.get(0));
			final Optional<MenuDto> optSubMenu = currentMenuItem.getChildren().stream()
					.filter(c -> Objects.nonNull(c))
					.filter(c -> c.getName().contentEquals(segmentToName(first))).findFirst();
			MenuDto subMenu = null;
			if (!optSubMenu.isPresent()) {
				subMenu = new MenuDto()
						.setDisplayText(first)
						.setName(segmentToName(first))
						.setIcon("folder")
						.setUrl("#");
				currentMenuItem.getChildren().add(subMenu);
			} else {
				subMenu = optSubMenu.get();
			}
			segments.remove(0);
			insertMenuAtPath(segments, subMenu, r);
		} else {
			currentMenuItem.getChildren().add(
				new MenuDto()
					.setDisplayText(r.getName())
					.setName(r.getItemId())
					.setIcon(r.getIcon())
					.setUrl(String.format("/a/%s/reports/%s", FranchiseManagerModule.KEY, r.getItemId())));
		}
	}
	
	private String segmentToName(String name) {
		return name.replace(" ", "_").toLowerCase();
	}

	private String cleanSegment(String string) {
		return string.trim();
	}

}
