import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model OwnerAddress
 *
 */
export type OwnerAddressModel = runtime.Types.Result.DefaultSelection<Prisma.$OwnerAddressPayload>;
export type AggregateOwnerAddress = {
    _count: OwnerAddressCountAggregateOutputType | null;
    _min: OwnerAddressMinAggregateOutputType | null;
    _max: OwnerAddressMaxAggregateOutputType | null;
};
export type OwnerAddressMinAggregateOutputType = {
    id: string | null;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    location: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type OwnerAddressMaxAggregateOutputType = {
    id: string | null;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    location: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type OwnerAddressCountAggregateOutputType = {
    id: number;
    fullName: number;
    email: number;
    phone: number;
    address: number;
    location: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type OwnerAddressMinAggregateInputType = {
    id?: true;
    fullName?: true;
    email?: true;
    phone?: true;
    address?: true;
    location?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type OwnerAddressMaxAggregateInputType = {
    id?: true;
    fullName?: true;
    email?: true;
    phone?: true;
    address?: true;
    location?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type OwnerAddressCountAggregateInputType = {
    id?: true;
    fullName?: true;
    email?: true;
    phone?: true;
    address?: true;
    location?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type OwnerAddressAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which OwnerAddress to aggregate.
     */
    where?: Prisma.OwnerAddressWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OwnerAddresses to fetch.
     */
    orderBy?: Prisma.OwnerAddressOrderByWithRelationInput | Prisma.OwnerAddressOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.OwnerAddressWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OwnerAddresses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OwnerAddresses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned OwnerAddresses
    **/
    _count?: true | OwnerAddressCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: OwnerAddressMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: OwnerAddressMaxAggregateInputType;
};
export type GetOwnerAddressAggregateType<T extends OwnerAddressAggregateArgs> = {
    [P in keyof T & keyof AggregateOwnerAddress]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOwnerAddress[P]> : Prisma.GetScalarType<T[P], AggregateOwnerAddress[P]>;
};
export type OwnerAddressGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OwnerAddressWhereInput;
    orderBy?: Prisma.OwnerAddressOrderByWithAggregationInput | Prisma.OwnerAddressOrderByWithAggregationInput[];
    by: Prisma.OwnerAddressScalarFieldEnum[] | Prisma.OwnerAddressScalarFieldEnum;
    having?: Prisma.OwnerAddressScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OwnerAddressCountAggregateInputType | true;
    _min?: OwnerAddressMinAggregateInputType;
    _max?: OwnerAddressMaxAggregateInputType;
};
export type OwnerAddressGroupByOutputType = {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    address: string | null;
    location: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: OwnerAddressCountAggregateOutputType | null;
    _min: OwnerAddressMinAggregateOutputType | null;
    _max: OwnerAddressMaxAggregateOutputType | null;
};
export type GetOwnerAddressGroupByPayload<T extends OwnerAddressGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OwnerAddressGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OwnerAddressGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OwnerAddressGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OwnerAddressGroupByOutputType[P]>;
}>>;
export type OwnerAddressWhereInput = {
    AND?: Prisma.OwnerAddressWhereInput | Prisma.OwnerAddressWhereInput[];
    OR?: Prisma.OwnerAddressWhereInput[];
    NOT?: Prisma.OwnerAddressWhereInput | Prisma.OwnerAddressWhereInput[];
    id?: Prisma.StringFilter<"OwnerAddress"> | string;
    fullName?: Prisma.StringFilter<"OwnerAddress"> | string;
    email?: Prisma.StringFilter<"OwnerAddress"> | string;
    phone?: Prisma.StringNullableFilter<"OwnerAddress"> | string | null;
    address?: Prisma.StringNullableFilter<"OwnerAddress"> | string | null;
    location?: Prisma.StringNullableFilter<"OwnerAddress"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"OwnerAddress"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"OwnerAddress"> | Date | string;
};
export type OwnerAddressOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    fullName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    location?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OwnerAddressWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    AND?: Prisma.OwnerAddressWhereInput | Prisma.OwnerAddressWhereInput[];
    OR?: Prisma.OwnerAddressWhereInput[];
    NOT?: Prisma.OwnerAddressWhereInput | Prisma.OwnerAddressWhereInput[];
    fullName?: Prisma.StringFilter<"OwnerAddress"> | string;
    phone?: Prisma.StringNullableFilter<"OwnerAddress"> | string | null;
    address?: Prisma.StringNullableFilter<"OwnerAddress"> | string | null;
    location?: Prisma.StringNullableFilter<"OwnerAddress"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"OwnerAddress"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"OwnerAddress"> | Date | string;
}, "id" | "email">;
export type OwnerAddressOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    fullName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    location?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.OwnerAddressCountOrderByAggregateInput;
    _max?: Prisma.OwnerAddressMaxOrderByAggregateInput;
    _min?: Prisma.OwnerAddressMinOrderByAggregateInput;
};
export type OwnerAddressScalarWhereWithAggregatesInput = {
    AND?: Prisma.OwnerAddressScalarWhereWithAggregatesInput | Prisma.OwnerAddressScalarWhereWithAggregatesInput[];
    OR?: Prisma.OwnerAddressScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OwnerAddressScalarWhereWithAggregatesInput | Prisma.OwnerAddressScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"OwnerAddress"> | string;
    fullName?: Prisma.StringWithAggregatesFilter<"OwnerAddress"> | string;
    email?: Prisma.StringWithAggregatesFilter<"OwnerAddress"> | string;
    phone?: Prisma.StringNullableWithAggregatesFilter<"OwnerAddress"> | string | null;
    address?: Prisma.StringNullableWithAggregatesFilter<"OwnerAddress"> | string | null;
    location?: Prisma.StringNullableWithAggregatesFilter<"OwnerAddress"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"OwnerAddress"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"OwnerAddress"> | Date | string;
};
export type OwnerAddressCreateInput = {
    id?: string;
    fullName: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    location?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OwnerAddressUncheckedCreateInput = {
    id?: string;
    fullName: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    location?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OwnerAddressUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OwnerAddressUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OwnerAddressCreateManyInput = {
    id?: string;
    fullName: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    location?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OwnerAddressUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OwnerAddressUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OwnerAddressCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fullName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OwnerAddressMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fullName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OwnerAddressMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fullName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OwnerAddressSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fullName?: boolean;
    email?: boolean;
    phone?: boolean;
    address?: boolean;
    location?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["ownerAddress"]>;
export type OwnerAddressSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fullName?: boolean;
    email?: boolean;
    phone?: boolean;
    address?: boolean;
    location?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["ownerAddress"]>;
export type OwnerAddressSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fullName?: boolean;
    email?: boolean;
    phone?: boolean;
    address?: boolean;
    location?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["ownerAddress"]>;
export type OwnerAddressSelectScalar = {
    id?: boolean;
    fullName?: boolean;
    email?: boolean;
    phone?: boolean;
    address?: boolean;
    location?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type OwnerAddressOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "fullName" | "email" | "phone" | "address" | "location" | "createdAt" | "updatedAt", ExtArgs["result"]["ownerAddress"]>;
export type $OwnerAddressPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "OwnerAddress";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        fullName: string;
        email: string;
        phone: string | null;
        address: string | null;
        location: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["ownerAddress"]>;
    composites: {};
};
export type OwnerAddressGetPayload<S extends boolean | null | undefined | OwnerAddressDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OwnerAddressPayload, S>;
export type OwnerAddressCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OwnerAddressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OwnerAddressCountAggregateInputType | true;
};
export interface OwnerAddressDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['OwnerAddress'];
        meta: {
            name: 'OwnerAddress';
        };
    };
    /**
     * Find zero or one OwnerAddress that matches the filter.
     * @param {OwnerAddressFindUniqueArgs} args - Arguments to find a OwnerAddress
     * @example
     * // Get one OwnerAddress
     * const ownerAddress = await prisma.ownerAddress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OwnerAddressFindUniqueArgs>(args: Prisma.SelectSubset<T, OwnerAddressFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OwnerAddressClient<runtime.Types.Result.GetResult<Prisma.$OwnerAddressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one OwnerAddress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OwnerAddressFindUniqueOrThrowArgs} args - Arguments to find a OwnerAddress
     * @example
     * // Get one OwnerAddress
     * const ownerAddress = await prisma.ownerAddress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OwnerAddressFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OwnerAddressFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OwnerAddressClient<runtime.Types.Result.GetResult<Prisma.$OwnerAddressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first OwnerAddress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerAddressFindFirstArgs} args - Arguments to find a OwnerAddress
     * @example
     * // Get one OwnerAddress
     * const ownerAddress = await prisma.ownerAddress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OwnerAddressFindFirstArgs>(args?: Prisma.SelectSubset<T, OwnerAddressFindFirstArgs<ExtArgs>>): Prisma.Prisma__OwnerAddressClient<runtime.Types.Result.GetResult<Prisma.$OwnerAddressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first OwnerAddress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerAddressFindFirstOrThrowArgs} args - Arguments to find a OwnerAddress
     * @example
     * // Get one OwnerAddress
     * const ownerAddress = await prisma.ownerAddress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OwnerAddressFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OwnerAddressFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OwnerAddressClient<runtime.Types.Result.GetResult<Prisma.$OwnerAddressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more OwnerAddresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerAddressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OwnerAddresses
     * const ownerAddresses = await prisma.ownerAddress.findMany()
     *
     * // Get first 10 OwnerAddresses
     * const ownerAddresses = await prisma.ownerAddress.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const ownerAddressWithIdOnly = await prisma.ownerAddress.findMany({ select: { id: true } })
     *
     */
    findMany<T extends OwnerAddressFindManyArgs>(args?: Prisma.SelectSubset<T, OwnerAddressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OwnerAddressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a OwnerAddress.
     * @param {OwnerAddressCreateArgs} args - Arguments to create a OwnerAddress.
     * @example
     * // Create one OwnerAddress
     * const OwnerAddress = await prisma.ownerAddress.create({
     *   data: {
     *     // ... data to create a OwnerAddress
     *   }
     * })
     *
     */
    create<T extends OwnerAddressCreateArgs>(args: Prisma.SelectSubset<T, OwnerAddressCreateArgs<ExtArgs>>): Prisma.Prisma__OwnerAddressClient<runtime.Types.Result.GetResult<Prisma.$OwnerAddressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many OwnerAddresses.
     * @param {OwnerAddressCreateManyArgs} args - Arguments to create many OwnerAddresses.
     * @example
     * // Create many OwnerAddresses
     * const ownerAddress = await prisma.ownerAddress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends OwnerAddressCreateManyArgs>(args?: Prisma.SelectSubset<T, OwnerAddressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many OwnerAddresses and returns the data saved in the database.
     * @param {OwnerAddressCreateManyAndReturnArgs} args - Arguments to create many OwnerAddresses.
     * @example
     * // Create many OwnerAddresses
     * const ownerAddress = await prisma.ownerAddress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many OwnerAddresses and only return the `id`
     * const ownerAddressWithIdOnly = await prisma.ownerAddress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends OwnerAddressCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OwnerAddressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OwnerAddressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a OwnerAddress.
     * @param {OwnerAddressDeleteArgs} args - Arguments to delete one OwnerAddress.
     * @example
     * // Delete one OwnerAddress
     * const OwnerAddress = await prisma.ownerAddress.delete({
     *   where: {
     *     // ... filter to delete one OwnerAddress
     *   }
     * })
     *
     */
    delete<T extends OwnerAddressDeleteArgs>(args: Prisma.SelectSubset<T, OwnerAddressDeleteArgs<ExtArgs>>): Prisma.Prisma__OwnerAddressClient<runtime.Types.Result.GetResult<Prisma.$OwnerAddressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one OwnerAddress.
     * @param {OwnerAddressUpdateArgs} args - Arguments to update one OwnerAddress.
     * @example
     * // Update one OwnerAddress
     * const ownerAddress = await prisma.ownerAddress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends OwnerAddressUpdateArgs>(args: Prisma.SelectSubset<T, OwnerAddressUpdateArgs<ExtArgs>>): Prisma.Prisma__OwnerAddressClient<runtime.Types.Result.GetResult<Prisma.$OwnerAddressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more OwnerAddresses.
     * @param {OwnerAddressDeleteManyArgs} args - Arguments to filter OwnerAddresses to delete.
     * @example
     * // Delete a few OwnerAddresses
     * const { count } = await prisma.ownerAddress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends OwnerAddressDeleteManyArgs>(args?: Prisma.SelectSubset<T, OwnerAddressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more OwnerAddresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerAddressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OwnerAddresses
     * const ownerAddress = await prisma.ownerAddress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends OwnerAddressUpdateManyArgs>(args: Prisma.SelectSubset<T, OwnerAddressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more OwnerAddresses and returns the data updated in the database.
     * @param {OwnerAddressUpdateManyAndReturnArgs} args - Arguments to update many OwnerAddresses.
     * @example
     * // Update many OwnerAddresses
     * const ownerAddress = await prisma.ownerAddress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more OwnerAddresses and only return the `id`
     * const ownerAddressWithIdOnly = await prisma.ownerAddress.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends OwnerAddressUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OwnerAddressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OwnerAddressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one OwnerAddress.
     * @param {OwnerAddressUpsertArgs} args - Arguments to update or create a OwnerAddress.
     * @example
     * // Update or create a OwnerAddress
     * const ownerAddress = await prisma.ownerAddress.upsert({
     *   create: {
     *     // ... data to create a OwnerAddress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OwnerAddress we want to update
     *   }
     * })
     */
    upsert<T extends OwnerAddressUpsertArgs>(args: Prisma.SelectSubset<T, OwnerAddressUpsertArgs<ExtArgs>>): Prisma.Prisma__OwnerAddressClient<runtime.Types.Result.GetResult<Prisma.$OwnerAddressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of OwnerAddresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerAddressCountArgs} args - Arguments to filter OwnerAddresses to count.
     * @example
     * // Count the number of OwnerAddresses
     * const count = await prisma.ownerAddress.count({
     *   where: {
     *     // ... the filter for the OwnerAddresses we want to count
     *   }
     * })
    **/
    count<T extends OwnerAddressCountArgs>(args?: Prisma.Subset<T, OwnerAddressCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OwnerAddressCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a OwnerAddress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerAddressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OwnerAddressAggregateArgs>(args: Prisma.Subset<T, OwnerAddressAggregateArgs>): Prisma.PrismaPromise<GetOwnerAddressAggregateType<T>>;
    /**
     * Group by OwnerAddress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerAddressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends OwnerAddressGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OwnerAddressGroupByArgs['orderBy'];
    } : {
        orderBy?: OwnerAddressGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OwnerAddressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOwnerAddressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the OwnerAddress model
     */
    readonly fields: OwnerAddressFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for OwnerAddress.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__OwnerAddressClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the OwnerAddress model
 */
export interface OwnerAddressFieldRefs {
    readonly id: Prisma.FieldRef<"OwnerAddress", 'String'>;
    readonly fullName: Prisma.FieldRef<"OwnerAddress", 'String'>;
    readonly email: Prisma.FieldRef<"OwnerAddress", 'String'>;
    readonly phone: Prisma.FieldRef<"OwnerAddress", 'String'>;
    readonly address: Prisma.FieldRef<"OwnerAddress", 'String'>;
    readonly location: Prisma.FieldRef<"OwnerAddress", 'String'>;
    readonly createdAt: Prisma.FieldRef<"OwnerAddress", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"OwnerAddress", 'DateTime'>;
}
/**
 * OwnerAddress findUnique
 */
export type OwnerAddressFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerAddress
     */
    select?: Prisma.OwnerAddressSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OwnerAddress
     */
    omit?: Prisma.OwnerAddressOmit<ExtArgs> | null;
    /**
     * Filter, which OwnerAddress to fetch.
     */
    where: Prisma.OwnerAddressWhereUniqueInput;
};
/**
 * OwnerAddress findUniqueOrThrow
 */
export type OwnerAddressFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerAddress
     */
    select?: Prisma.OwnerAddressSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OwnerAddress
     */
    omit?: Prisma.OwnerAddressOmit<ExtArgs> | null;
    /**
     * Filter, which OwnerAddress to fetch.
     */
    where: Prisma.OwnerAddressWhereUniqueInput;
};
/**
 * OwnerAddress findFirst
 */
export type OwnerAddressFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerAddress
     */
    select?: Prisma.OwnerAddressSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OwnerAddress
     */
    omit?: Prisma.OwnerAddressOmit<ExtArgs> | null;
    /**
     * Filter, which OwnerAddress to fetch.
     */
    where?: Prisma.OwnerAddressWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OwnerAddresses to fetch.
     */
    orderBy?: Prisma.OwnerAddressOrderByWithRelationInput | Prisma.OwnerAddressOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OwnerAddresses.
     */
    cursor?: Prisma.OwnerAddressWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OwnerAddresses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OwnerAddresses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OwnerAddresses.
     */
    distinct?: Prisma.OwnerAddressScalarFieldEnum | Prisma.OwnerAddressScalarFieldEnum[];
};
/**
 * OwnerAddress findFirstOrThrow
 */
export type OwnerAddressFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerAddress
     */
    select?: Prisma.OwnerAddressSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OwnerAddress
     */
    omit?: Prisma.OwnerAddressOmit<ExtArgs> | null;
    /**
     * Filter, which OwnerAddress to fetch.
     */
    where?: Prisma.OwnerAddressWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OwnerAddresses to fetch.
     */
    orderBy?: Prisma.OwnerAddressOrderByWithRelationInput | Prisma.OwnerAddressOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OwnerAddresses.
     */
    cursor?: Prisma.OwnerAddressWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OwnerAddresses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OwnerAddresses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OwnerAddresses.
     */
    distinct?: Prisma.OwnerAddressScalarFieldEnum | Prisma.OwnerAddressScalarFieldEnum[];
};
/**
 * OwnerAddress findMany
 */
export type OwnerAddressFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerAddress
     */
    select?: Prisma.OwnerAddressSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OwnerAddress
     */
    omit?: Prisma.OwnerAddressOmit<ExtArgs> | null;
    /**
     * Filter, which OwnerAddresses to fetch.
     */
    where?: Prisma.OwnerAddressWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OwnerAddresses to fetch.
     */
    orderBy?: Prisma.OwnerAddressOrderByWithRelationInput | Prisma.OwnerAddressOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing OwnerAddresses.
     */
    cursor?: Prisma.OwnerAddressWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OwnerAddresses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OwnerAddresses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OwnerAddresses.
     */
    distinct?: Prisma.OwnerAddressScalarFieldEnum | Prisma.OwnerAddressScalarFieldEnum[];
};
/**
 * OwnerAddress create
 */
export type OwnerAddressCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerAddress
     */
    select?: Prisma.OwnerAddressSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OwnerAddress
     */
    omit?: Prisma.OwnerAddressOmit<ExtArgs> | null;
    /**
     * The data needed to create a OwnerAddress.
     */
    data: Prisma.XOR<Prisma.OwnerAddressCreateInput, Prisma.OwnerAddressUncheckedCreateInput>;
};
/**
 * OwnerAddress createMany
 */
export type OwnerAddressCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many OwnerAddresses.
     */
    data: Prisma.OwnerAddressCreateManyInput | Prisma.OwnerAddressCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * OwnerAddress createManyAndReturn
 */
export type OwnerAddressCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerAddress
     */
    select?: Prisma.OwnerAddressSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the OwnerAddress
     */
    omit?: Prisma.OwnerAddressOmit<ExtArgs> | null;
    /**
     * The data used to create many OwnerAddresses.
     */
    data: Prisma.OwnerAddressCreateManyInput | Prisma.OwnerAddressCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * OwnerAddress update
 */
export type OwnerAddressUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerAddress
     */
    select?: Prisma.OwnerAddressSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OwnerAddress
     */
    omit?: Prisma.OwnerAddressOmit<ExtArgs> | null;
    /**
     * The data needed to update a OwnerAddress.
     */
    data: Prisma.XOR<Prisma.OwnerAddressUpdateInput, Prisma.OwnerAddressUncheckedUpdateInput>;
    /**
     * Choose, which OwnerAddress to update.
     */
    where: Prisma.OwnerAddressWhereUniqueInput;
};
/**
 * OwnerAddress updateMany
 */
export type OwnerAddressUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update OwnerAddresses.
     */
    data: Prisma.XOR<Prisma.OwnerAddressUpdateManyMutationInput, Prisma.OwnerAddressUncheckedUpdateManyInput>;
    /**
     * Filter which OwnerAddresses to update
     */
    where?: Prisma.OwnerAddressWhereInput;
    /**
     * Limit how many OwnerAddresses to update.
     */
    limit?: number;
};
/**
 * OwnerAddress updateManyAndReturn
 */
export type OwnerAddressUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerAddress
     */
    select?: Prisma.OwnerAddressSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the OwnerAddress
     */
    omit?: Prisma.OwnerAddressOmit<ExtArgs> | null;
    /**
     * The data used to update OwnerAddresses.
     */
    data: Prisma.XOR<Prisma.OwnerAddressUpdateManyMutationInput, Prisma.OwnerAddressUncheckedUpdateManyInput>;
    /**
     * Filter which OwnerAddresses to update
     */
    where?: Prisma.OwnerAddressWhereInput;
    /**
     * Limit how many OwnerAddresses to update.
     */
    limit?: number;
};
/**
 * OwnerAddress upsert
 */
export type OwnerAddressUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerAddress
     */
    select?: Prisma.OwnerAddressSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OwnerAddress
     */
    omit?: Prisma.OwnerAddressOmit<ExtArgs> | null;
    /**
     * The filter to search for the OwnerAddress to update in case it exists.
     */
    where: Prisma.OwnerAddressWhereUniqueInput;
    /**
     * In case the OwnerAddress found by the `where` argument doesn't exist, create a new OwnerAddress with this data.
     */
    create: Prisma.XOR<Prisma.OwnerAddressCreateInput, Prisma.OwnerAddressUncheckedCreateInput>;
    /**
     * In case the OwnerAddress was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.OwnerAddressUpdateInput, Prisma.OwnerAddressUncheckedUpdateInput>;
};
/**
 * OwnerAddress delete
 */
export type OwnerAddressDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerAddress
     */
    select?: Prisma.OwnerAddressSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OwnerAddress
     */
    omit?: Prisma.OwnerAddressOmit<ExtArgs> | null;
    /**
     * Filter which OwnerAddress to delete.
     */
    where: Prisma.OwnerAddressWhereUniqueInput;
};
/**
 * OwnerAddress deleteMany
 */
export type OwnerAddressDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which OwnerAddresses to delete
     */
    where?: Prisma.OwnerAddressWhereInput;
    /**
     * Limit how many OwnerAddresses to delete.
     */
    limit?: number;
};
/**
 * OwnerAddress without action
 */
export type OwnerAddressDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerAddress
     */
    select?: Prisma.OwnerAddressSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OwnerAddress
     */
    omit?: Prisma.OwnerAddressOmit<ExtArgs> | null;
};
//# sourceMappingURL=OwnerAddress.d.ts.map