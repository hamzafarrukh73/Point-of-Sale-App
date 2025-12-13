<script setup lang="ts">
definePageMeta({
  layout: 'dash'
})

const categoriesStore = useCategoriesStore()
categoriesStore.fetchItems()

const { getItems: categories } = storeToRefs(categoriesStore)

const newItem = ref({
  name: ''
})
const createItem = async () => {
  await categoriesStore.createItem(newItem.value)
  newItem.value = {
    name: ''
  }
}

const updateItem = async (newValues: object) => {
  await categoriesStore.updateItem(newValues)
}

const deleteItem = async (id: any) => {
  await categoriesStore.deleteItem(id)
}

const orderingOptions = categoriesStore.orderingOptions
  ? Object.keys(categoriesStore.orderingOptions)
  : []
const ordering = ref(orderingOptions[0] || '')
const sortItems = async () => {
  categoriesStore.sortItems(ordering.value)
}

const filters = ref({
  search: ''
})
const filterItems = async () => {
  categoriesStore.filterItems(filters.value)
}
</script>

<template>
  <UPage>
    <UPageHeader>
      <UContainer class="flex w-full max-w-full col-span-3 gap-3 !p-0 !m-0 justify-between">
        <UForm class="w-1/2" @submit="filterItems">
          <UFieldGroup class="flex w-full">
            <UInput
              type="search"
              placeholder="Search"
              class="flex-grow"
              color="primary"
              size="lg"
              v-model="filters.search"
            />
            <UButton
              type="submit"
              icon="i-fa-search"
              class="w-fit"
              color="primary"
              variant="subtle"
              size="md"
            />
          </UFieldGroup>
        </UForm>

        <UContainer class="flex w-fit justify-end items-center gap-3 !p-0 !m-0">
          <UModal title="New Category">
            <UButton label="Add Category" />
            <template #body>
              <UContainer class="w-full !m-0 !p-0">
                <UForm id="create-category-form" @submit="createItem">
                  <UFormField label="Category">
                    <UInput v-model="newItem.name" placeholder="Enter Name" class="w-full" />
                  </UFormField>
                </UForm>
              </UContainer>
            </template>

            <template #footer>
              <UContainer class="w-full flex justify-end !m-0 !p-0">
                <UButton label="Create" type="submit" form="create-category-form" />
              </UContainer>
            </template>
          </UModal>
          <UForm class="w-fit">
            <USelectMenu
              placeholder="Sort by"
              :items="orderingOptions"
              @change="sortItems"
              v-model="ordering"
              arrow
              variant="soft"
              color="primary"
              size="md"
              class="w-fit"
              :ui="{ content: 'min-w-fit' }"
            />
          </UForm>
        </UContainer>
      </UContainer>
    </UPageHeader>

    <UPageBody>
      <UPageGrid>
        <UPageCard
          v-for="category in categories"
          variant="soft"
          :key="category.id"
          class="col-span-1"
        >
          <template #default>
            <UContainer class="grid grid-cols-4 w-full justify-between items-center !p-0 !m-0">
              <div class="col-span-2">
                <h5 class="font-semibold truncate w-full">{{ category.name }}</h5>
              </div>
              <div></div>
              <UContainer class="flex flex-row col-span-1 gap-3 !p-0 !m-0 justify-end">
                <UModal title="Edit Category">
                  <UButton
                    icon="i-fa-edit"
                    color="primary"
                    class="flex-shrink-0 place-items-center"
                  />
                  <template #body>
                    <UForm
                      id="create-category-form"
                      @submit="
                        updateItem(
                          (newValues = {
                            id: category.id,
                            name: category.name
                          })
                        )
                      "
                    >
                      <UFormField label="Category">
                        <UInput v-model="category.name" placeholder="Enter Name" class="w-full" />
                      </UFormField>
                    </UForm>
                  </template>

                  <template #footer>
                    <UContainer class="w-full flex justify-end !m-0 !p-0">
                      <UButton label="Save" type="submit" form="create-category-form" />
                    </UContainer>
                  </template>
                </UModal>

                <UModal title="Delete Category">
                  <UButton
                    icon="i-fa-trash"
                    color="error"
                    class="flex-shrink-0 place-items-center"
                  />
                  <template #body>
                    <UForm id="delete-category-form" @submit="deleteItem(category.id)">
                      <h6>
                        Are you sure you want to delete <strong>"{{ category.name }}"</strong>?
                      </h6>
                    </UForm>
                  </template>

                  <template #footer>
                    <UContainer class="w-full flex justify-end !m-0 !p-0">
                      <UButton
                        label="Delete"
                        color="error"
                        type="submit"
                        form="delete-category-form"
                      />
                    </UContainer>
                  </template>
                </UModal>
              </UContainer>
            </UContainer>
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageBody>
  </UPage>
</template>
