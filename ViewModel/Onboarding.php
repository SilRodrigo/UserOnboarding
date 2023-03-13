<?php

namespace Rsilva\UserOnboarding\ViewModel;

use Magento\Framework\Api\FilterBuilder;
use Magento\Framework\Api\Search\FilterGroupBuilder;
use Magento\Framework\Api\Search\SearchCriteriaBuilder;
use Magento\Framework\Api\SortOrderBuilder;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Framework\UrlInterface;
use Rsilva\UserOnboarding\Api\Data\OnboardingInterface;
use Rsilva\UserOnboarding\Api\OnboardingRepositoryInterface;

class Onboarding implements ArgumentInterface
{

    public function __construct(
        protected OnboardingRepositoryInterface $onboardingRepository,
        protected SearchCriteriaBuilder $searchCriteriaBuilder,
        protected FilterGroupBuilder $filterGroupBuilder,
        protected FilterBuilder $filterBuilder,
        protected SortOrderBuilder $sortOrderBuilder,
        protected UrlInterface $url,
    ) {
    }

    public function get()
    {
        $routeParams = ['_use_rewrite' => true, '_forced_secure' => true];
        $currentUrl = $this->url->getUrl('*/*/*', $routeParams);

        $filterGroups = [
            $this->filterGroupBuilder->addFilter(
                $this->filterBuilder
                    ->setField(OnboardingInterface::PAGE_URL)
                    ->setConditionType(OnboardingRepositoryInterface::EQ)
                    ->setValue($currentUrl)
                    ->create()
            )->create(),
            $this->filterGroupBuilder->addFilter(
                $this->filterBuilder
                    ->setField(OnboardingInterface::ENABLED)
                    ->setConditionType(OnboardingRepositoryInterface::EQ)
                    ->setValue(OnboardingRepositoryInterface::TRUE)
                    ->create()
            )->create()
        ];

        $sortOrder = $this->sortOrderBuilder
            ->setField(OnboardingInterface::ONBOARDING_ID)
            ->setDirection(OnboardingRepositoryInterface::SORT_DESC)
            ->create();

        $searchCriteria = $this->searchCriteriaBuilder->create()
            ->setFilterGroups($filterGroups)
            ->setSortOrders([$sortOrder]);

        $list = $this->onboardingRepository->getList($searchCriteria);

        $options = [];
        foreach ($list->getItems() as $item) {
            $options[] = $item->toJson();
        }

        return json_encode($options);
    }
}
